import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";

const INIT_AMOUNT = 99999999999999;

describe("Token contract", function () {
  // define fixture
  async function deployTokenFixture() {
    const Token = await ethers.getContractFactory("FsKlay");
    const [owner, user1, user2] = await ethers.getSigners();

    const FsKlayToken = await Token.deploy();

    await FsKlayToken.deployed();
    return { FsKlayToken, owner, user1, user2 };
  }

  describe("Deployment", function () {
    it("should deploy FsKlay", async function () {
      const { FsKlayToken } = await loadFixture(deployTokenFixture);

      const name = await FsKlayToken.name();
      const symbol = await FsKlayToken.symbol();
      const totalSupply = await FsKlayToken.totalSupply();

      expect(name).to.equal("My Flash Token");
      expect(symbol).to.equal("FsKlay");
      expect(totalSupply).to.equal(INIT_AMOUNT);
    });

    it("should set the right owner", async function () {
      const { FsKlayToken, owner } = await loadFixture(deployTokenFixture);

      expect(await FsKlayToken.signer.getAddress()).to.equal(owner.address);
    });

    it("should assign the total supply of tokens to the owner", async function () {
      const { FsKlayToken, owner } = await loadFixture(deployTokenFixture);
      const ownerBalance = await FsKlayToken.balanceOf(owner.address);
      expect(await FsKlayToken.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Mint", function () {
    it("should make tokens when contract created", async function () {
      const { FsKlayToken } = await loadFixture(deployTokenFixture);
      expect(await FsKlayToken.totalSupply()).to.equal(INIT_AMOUNT);
    });
    it("can't make tokens in other accounts", async function () {
      const { FsKlayToken, user1, user2 } = await loadFixture(
        deployTokenFixture
      );
      const user1Balance = await FsKlayToken.balanceOf(user1.address);
      const user2Balance = await FsKlayToken.balanceOf(user2.address);

      expect(await FsKlayToken.totalSupply()).not.to.equal(user1Balance);
      expect(await FsKlayToken.totalSupply()).not.to.equal(user2Balance);
    });
  });

  describe("Transactions", function () {
    it("should transfer tokens between accounts", async function () {
      const { FsKlayToken, owner, user1, user2 } = await loadFixture(
        deployTokenFixture
      );

      // Transfer 50 tokens from owner to user1
      await expect(
        FsKlayToken.transfer(user1.address, 50)
      ).to.changeTokenBalances(FsKlayToken, [owner, user1], [-50, 50]);

      // Transfer 30 tokens from user1 to user2
      await expect(
        FsKlayToken.connect(user1).transfer(user2.address, 30)
      ).to.changeTokenBalances(FsKlayToken, [user1, user2], [-30, 30]);
    });

    it("should emit Transfer events", async function () {
      const { FsKlayToken, owner, user1, user2 } = await loadFixture(
        deployTokenFixture
      );

      await expect(FsKlayToken.transfer(user1.address, 50))
        .to.emit(FsKlayToken, "Transfer")
        .withArgs(owner.address, user1.address, 50);

      await expect(FsKlayToken.connect(user1).transfer(user2.address, 50))
        .to.emit(FsKlayToken, "Transfer")
        .withArgs(user1.address, user2.address, 50);
    });

    it("should fail if sender doesn't have enough tokens", async function () {
      const { FsKlayToken, owner, user1 } = await loadFixture(
        deployTokenFixture
      );
      const initialOwnerBalance = await FsKlayToken.balanceOf(owner.address);

      await expect(
        FsKlayToken.connect(user1).transfer(owner.address, 1)
      ).to.be.revertedWith("KIP7: Not enough balances");

      // Verify balances have not changed
      expect(await FsKlayToken.balanceOf(owner.address)).to.equal(
        initialOwnerBalance
      );
      expect(await FsKlayToken.balanceOf(user1.address)).to.equal(0);
    });

    it("should not allow transfers if spender is not approved", async function () {
      const { FsKlayToken, owner, user1, user2 } = await loadFixture(
        deployTokenFixture
      );

      // Attempt transfer without approval
      await expect(
        FsKlayToken.connect(user1).transferFrom(
          owner.address,
          user2.address,
          50
        )
      ).to.be.revertedWith("KIP7: insufficient allowance");

      // Verify balances have not changed
      expect(await FsKlayToken.balanceOf(owner.address)).to.equal(INIT_AMOUNT);
      expect(await FsKlayToken.balanceOf(user1.address)).to.equal(0);
      expect(await FsKlayToken.balanceOf(user2.address)).to.equal(0);
    });

    it("should allow approved transfers", async function () {
      const { FsKlayToken, owner, user1, user2 } = await loadFixture(
        deployTokenFixture
      );

      // Approve transfer from owner to user1
      await FsKlayToken.approve(user1.address, 50);

      // Attempt transfer from owner to user2 using user1 as intermediary
      await expect(
        FsKlayToken.connect(user1).transferFrom(
          owner.address,
          user2.address,
          50
        )
      ).to.changeTokenBalances(FsKlayToken, [owner, user2], [-50, 50]);

      // Verify balances have updated
      expect(await FsKlayToken.balanceOf(owner.address)).to.equal(
        INIT_AMOUNT - 50
      );
      expect(await FsKlayToken.balanceOf(user1.address)).to.equal(0);
      expect(await FsKlayToken.balanceOf(user2.address)).to.equal(50);

      // Verify approval event emitted
      await expect(FsKlayToken.approve(user1.address, 50))
        .to.emit(FsKlayToken, "Approval")
        .withArgs(owner.address, user1.address, 50);
    });

    it("should not allow approved transfers if insufficient balance", async function () {
      const { FsKlayToken, owner, user1, user2 } = await loadFixture(
        deployTokenFixture
      );

      // Approve transfer from owner to user1
      await FsKlayToken.approve(user1.address, INIT_AMOUNT + 1);

      // Attempt transfer from owner to user2 using user1 as intermediary
      await expect(
        FsKlayToken.connect(user1).transferFrom(
          owner.address,
          user2.address,
          INIT_AMOUNT + 1
        )
      ).to.be.revertedWith("KIP7: Not enough balances");

      // Verify balances have not changed
      expect(await FsKlayToken.balanceOf(owner.address)).to.equal(INIT_AMOUNT);
      expect(await FsKlayToken.balanceOf(user1.address)).to.equal(0);
      expect(await FsKlayToken.balanceOf(user2.address)).to.equal(0);
    });
  });
});

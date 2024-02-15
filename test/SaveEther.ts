import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect } from "chai";
import { ethers } from "hardhat";

describe("SaveEther", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deploySaveEther() {
    // Contracts are deployed using the first signer/account by default
    const [owner, account1, account2] = await ethers.getSigners();

    const SaveEther = await ethers.getContractFactory("SaveEther");
    const saveEther = await SaveEther.deploy();
    const amountToDeposit = ethers.parseEther("1.0");

    return { saveEther, owner, account1, account2, amountToDeposit };
  }
  describe("Checking contract  balance  ", function () {
    it("should get balance ", async function () {
      const { saveEther } = await loadFixture(deploySaveEther);

      const bal = await saveEther.checkContractBal();
      expect(bal).to.equal(0);
    });

    it("should check balance", async function () {
      const { saveEther, account1 } = await loadFixture(deploySaveEther);

      const checkBalance = await saveEther.checkSavings(account1.address);

      expect(checkBalance).to.equal(0);
      // });
      // it("should send out savings to other saving account", async function () {
      //   const { saveEther, account1, account2, amountToDeposit } =
      //     await loadFixture(deploySaveEther);

      //   await saveEther.deposit({ value: amountToDeposit });

      //   const beforeSending = await saveEther.checkSavings(account1.address);

      //   expect(amountToDeposit).to.equal(beforeSending);

      // const sendAmount = ethers.parseEther("0.2");

      // await saveEther.sendOutSaving(account2.address, sendAmount);

      // const afterTransferred = await saveEther.checkSavings(account1.address);
      // expect(afterTransferred).to.equal(amountToDeposit - sendAmount);
    });
    it("can send savings to another account ", async () => {
      const { saveEther,owner, account1, account2, amountToDeposit } =
        await loadFixture(deploySaveEther);
      await saveEther.deposit({ value: amountToDeposit });

      const amountToSend = ethers.parseEther("0.5");
      const beforeTransferBalance = await saveEther.checkSavings(
        owner.address
      );
      expect(beforeTransferBalance).to.equal(amountToDeposit);

      await saveEther.sendOutSaving(account1.address, amountToSend);

      const afterTransferBalance = await saveEther.checkSavings(account1.address)
      expect(afterTransferBalance).to.equal(amountToSend);
    });
  });
});

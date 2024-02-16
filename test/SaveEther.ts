import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

import { expect, assert} from "chai";
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
    const amountToDeposit = ethers.parseEther("5");

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
      });

      it("check if owner can check balance", async function (){
        const { saveEther, owner } = await loadFixture(deploySaveEther);
        const ownerCheckBalance = await saveEther.checkSavings(owner);
        expect(ownerCheckBalance).to.equal(0);
      })
    });

    it("can send savings to another account", async () => {
      const { saveEther, owner, account1, account2, amountToDeposit } = await loadFixture(deploySaveEther);
      await saveEther.deposit({ value: amountToDeposit });
    
      const amountToSend = ethers.parseEther("0.5");
      const beforeTransferBalance = await saveEther.checkSavings(owner.address);
      expect(beforeTransferBalance).to.equal(amountToDeposit);
    
      const tx = await saveEther.sendOutSaving(account1.address, amountToSend);
    
      const afterTransferBalance = await saveEther.checkSavings(owner.address);
      const expectedBalance = (beforeTransferBalance-amountToSend);
      expect(afterTransferBalance).to.equal(expectedBalance);
    });
    it("can not send more than what is inside the savings to another account", async () => {
      const { saveEther, owner, account1, account2, amountToDeposit } = await loadFixture(deploySaveEther);
      await saveEther.deposit({ value: amountToDeposit });
    
      const amountToSend = ethers.parseEther("10");
      const beforeTransferBalance = await saveEther.checkSavings(owner.address);
      expect(beforeTransferBalance).to.equal(amountToDeposit);
    
      const tx = await saveEther.sendOutSaving(account1.address, amountToSend);
    
      const afterTransferBalance = await saveEther.checkSavings(owner.address);
      const expectedBalance = (beforeTransferBalance-amountToSend);
      expect(afterTransferBalance).to.equal(expectedBalance);
    });
    it("can not send 0 ether inside the  savings to another account", async () => {
      const { saveEther, owner, account1, account2, amountToDeposit } = await loadFixture(deploySaveEther);
      await saveEther.deposit({ value: amountToDeposit });
    
      const amountToSend = ethers.parseEther("0");
      const beforeTransferBalance = await saveEther.checkSavings(owner.address);
      expect(beforeTransferBalance).to.equal(amountToDeposit);
    
      const tx = await saveEther.sendOutSaving(account1.address, amountToSend);
    
      const afterTransferBalance = await saveEther.checkSavings(owner.address);
      const expectedBalance = (beforeTransferBalance-amountToSend);
      expect(afterTransferBalance).to.equal(expectedBalance);
    });
    it("can withdraw savings from the contract", async () => {
      const { saveEther, owner, account1, account2, amountToDeposit } = await loadFixture(deploySaveEther);
      await saveEther.deposit({ value: amountToDeposit });
    
      // Check the initial savings of the owner
      const initialOwnerSavings = await saveEther.checkSavings(owner.address);
    
      // Withdraw savings from the contract
      await saveEther.withdraw();
    
      // Check if the owner's savings have been correctly deducted
      const finalOwnerSavings = await saveEther.checkSavings(owner.address);
      expect(finalOwnerSavings).to.equal(0);
    
      // Check if the owner's balance has increased accordingly
      const ownerBalanceAfterWithdrawal = await ethers.provider.getBalance(owner.address);
      expect(ownerBalanceAfterWithdrawal).to.be.above(initialOwnerSavings);
    });
    it("can withdraw savings from the contract", async () => {
      const { saveEther, owner, account1, account2, amountToDeposit } = await loadFixture(deploySaveEther);
      await saveEther.deposit({ value: amountToDeposit });
    
      // Check the initial savings of the owner
      const initialOwnerSavings = await saveEther.checkSavings(owner.address);
    
      // Withdraw savings from the contract
      await saveEther.withdraw();
    
      // Check if the owner's savings have been correctly deducted
      const finalOwnerSavings = await saveEther.checkSavings(owner.address);
      expect(finalOwnerSavings).to.equal(0);
    
      // Check if the owner's balance has increased accordingly
      const ownerBalanceAfterWithdrawal = await ethers.provider.getBalance(owner.address);
      expect(ownerBalanceAfterWithdrawal).to.be.above(initialOwnerSavings);
    });
    it("can deposit into the savings", async () => {
      const { saveEther, owner, account1, account2, amountToDeposit } = await loadFixture(deploySaveEther);
      const initialOwnerSavings = await saveEther.checkSavings(owner.address);
    
      const amountToDeposits = ethers.parseEther("1"); // Amount to deposit
    
      // Perform deposit into the savings
      await saveEther.deposit({ value: amountToDeposit });
    
      // Check if the owner's savings have increased accordingly
      const finalOwnerSavings = await saveEther.checkSavings(owner.address);
      expect(finalOwnerSavings).to.equal(initialOwnerSavings + amountToDeposit);
    });
    

  });
// });

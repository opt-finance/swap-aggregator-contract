const { ethers } = require("hardhat");

/* Settings */
const REPEAT = 5000;
const BLOCK_INTERVAL = 1000;

function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}

async function main() {
    const optAgg = await ethers.getContractAt("IAggregator", "0x8af1C50eCD5167B97e14Fc25235580c84d5ea22F");
    const wwemix = await ethers.getContractAt("IWWEMIX", "0x7D72b22a74A216Af4a002a1095C8C707d6eC1C5f");
    const wemixD = await hre.ethers.getContractAt("IERC20", "0x8E81fCc2d4A3bAa0eE9044E0D7E36F59C9BbA9c1");

    const to = "0x00caEc2e118AbC4c510440A8D1ac8565Fec0180C";
    const deadline = "0x20000000000";
    const amountIn = "1";
    const amountOutMin = "0";
    const pathV2 = [await wwemix.getAddress(), await wemixD.getAddress()];

    /* Deposit WEMIX -> WWEMIX */
    const depositTxRes = await wwemix.deposit({
        value: ethers.toBigInt(amountIn) * ethers.toBigInt(REPEAT)
    });
    await depositTxRes.wait();
    /* Approve WWEMIX */
    let approveWwemixTxRes = await wwemix.approve(await optAgg.getAddress(), ethers.MaxUint256);
    await approveWwemixTxRes.wait();

    /*******************************************

        $$$$$$$\            $$$$$$$$\ $$$$$$$$\ 
        $$  __$$\           $$  _____|\__$$  __|
        $$ |  $$ | $$$$$$\  $$ |         $$ |   
        $$$$$$$  |$$  __$$\ $$$$$\       $$ |   
        $$  ____/ $$ /  $$ |$$  __|      $$ |   
        $$ |      $$ |  $$ |$$ |         $$ |   
        $$ |      \$$$$$$  |$$$$$$$$\    $$ |   
        \__|       \______/ \________|   \__|   
    
    ********************************************
    **** Contribute to OPT via PoET Rewards ****
    *******************************************/

    for (let i = 0; i < REPEAT; i++) {
        const swapTxRes = await optAgg.swapExactTokensForTokens(
            amountIn,
            amountOutMin,
            pathV2,
            to,
            deadline
        );
        console.log(`${i}: ${(await swapTxRes.wait()).hash}`);

        await sleep(BLOCK_INTERVAL);
    }
}

main();

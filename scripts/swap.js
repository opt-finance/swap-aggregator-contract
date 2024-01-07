const { ethers } = require("hardhat");

async function main() {
    const optAgg = await ethers.getContractAt("IAggregator", "0x8af1C50eCD5167B97e14Fc25235580c84d5ea22F");
    const routerv3 = await ethers.getContractAt("IWeswapV3Router", "0xBD2284D40cB7Da2c5527252F84ae49a96625fbCF");
    const wwemix = await ethers.getContractAt("IWWEMIX", "0x7D72b22a74A216Af4a002a1095C8C707d6eC1C5f");
    const wemixD = await hre.ethers.getContractAt("IERC20", "0x8E81fCc2d4A3bAa0eE9044E0D7E36F59C9BbA9c1");

    const amountIn = "1";
    const params = {
        tokenIn: await wwemix.getAddress(),
        tokenOut: await wemixD.getAddress(),
        fee: 500,
        recipient: "0x00caEc2e118AbC4c510440A8D1ac8565Fec0180C",
        deadline: "0x20000000000",
        amountIn: amountIn,
        amountOutMinimum: "0",
        sqrtPriceLimitX96: "0",
    };

    /* Deposit WEMIX -> WWEMIX */
    const depositTxRes = await wwemix.deposit({ value: ethers.toBigInt(amountIn) * 2n });
    await depositTxRes.wait();
    /* Approve WWEMIX */
    let approveWwemixTxRes = await wwemix.approve(await optAgg.getAddress(), ethers.MaxUint256);
    await approveWwemixTxRes.wait();
    approveWwemixTxRes = await wwemix.approve(await routerv3.getAddress(), ethers.MaxUint256);
    await approveWwemixTxRes.wait();

    /* Swap */

    // v3::exactInputSingle(Token)
    params.to = await routerv3.getAddress();
    let swapTxRes = await routerv3.exactInputSingle(params);
    console.log(` v3::exactInputSingle(Token)\t: ${(await swapTxRes.wait()).gasUsed}`);

    // optAgg::exactInputSingle(Token)
    params.to = await optAgg.getAddress();
    swapTxRes = await optAgg.exactInputSingle(params);
    console.log(`opt::exactInputSingle(Token)\t: ${(await swapTxRes.wait()).gasUsed}`);
}

main();

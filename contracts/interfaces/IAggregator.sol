// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import {IWeswapV2Router} from "./IWeswapV2Router.sol";
import {IWeswapV3Router} from "./IWeswapV3Router.sol";

interface IAggregator is IWeswapV2Router, IWeswapV3Router {
    struct MultiPathSwapOut {
        bytes[][] paths;
        address recipient;
        uint256 deadline;
        address tokenIn;
        address tokenOut;
        uint256[] amountIns;
        uint256 amountOutMinimum;
    }

    function multiPathSwapOut(
        MultiPathSwapOut calldata params
    )
        external
        payable
        returns (
            uint256 amountIn,
            uint256 amountOut,
            uint256 onlyOnePathAmountOut
        );
}

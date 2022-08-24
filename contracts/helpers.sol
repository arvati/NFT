// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

interface IERC20 {
    function balanceOf(address account) external view returns (uint);
    function transfer(address recipient, uint amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint);
    function approve(address spender, uint amount) external returns (bool);
    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}

interface IERC1155 {
    function balanceOf(address account, uint256 id) external view returns (uint256);
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external;

    event TransferSingle(address indexed operator, address indexed from, address indexed to, uint256 id, uint256 value);
}

library StringsHelper {
    function isEmpty(string memory text)
        internal pure
        returns (bool)
    {
        return (bytes(text).length > 0) ? false : true ;
    }

    function concat(string memory text1, string memory text2)
        internal pure
        returns (string memory)
    {
        unchecked {
            if (!isEmpty(text1) && !isEmpty(text2)) {
                return string(abi.encodePacked(text1, text2));
            }
            else if (!isEmpty(text1)) {
                return text1;
            }
            else if (!isEmpty(text2)) {
                return text2;
            } else {
                return "";
            }
        }
    }

    function includes(string memory where, string memory what) 
        internal pure
        returns (bool)
    {
        bytes memory whatBytes = bytes (what);
        bytes memory whereBytes = bytes (where);
        unchecked {
            if (isEmpty(where) || isEmpty(what)) {
                return false;
            }
            if (whereBytes.length < whatBytes.length) {
                whereBytes = whatBytes;
                whatBytes = bytes (where);
            }
            bool found = false;
            for (uint i = 0; i <= whereBytes.length - whatBytes.length; i++) {
                bool flag = true;
                for (uint j = 0; j < whatBytes.length; j++)
                    if (whereBytes [i + j] != whatBytes [j]) {
                        flag = false;
                        break;
                    }
                if (flag) {
                    found = true;
                    break;
                }
            }
            return found;
        }
    }
}
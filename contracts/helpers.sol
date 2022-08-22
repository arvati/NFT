// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

library StringsHelper {
    function concatenate(string memory text1, string memory text2)
        internal pure
        returns (string memory)
    {
        unchecked {
            if (bytes(text2).length > 0) {
                return bytes(text1).length > 0 ? string(abi.encodePacked(text1, text2)) : text2;
            } else {
                return bytes(text1).length > 0 ? text1 : "";
            }
        }
    }

    function contains(string memory where, string memory what) 
        internal pure
        returns (bool)
    {
        bytes memory whatBytes = bytes (what);
        bytes memory whereBytes = bytes (where);
        unchecked {
            if (whereBytes.length == 0 || whatBytes.length == 0) {
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
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

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
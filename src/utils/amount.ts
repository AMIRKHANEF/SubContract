import { hexToBn, isHex } from "@polkadot/util";
import { DEFAULT_DECIMAL_POINT_DIGIT } from "./constants";

/**
 * Converts a raw amount to a human-readable format by adjusting for decimals.
 *
 * - Removes any commas from the input amount.
 * - Divides the amount by 10 raised to the power of `decimal` to get the human-readable value.
 * - Uses `formatDecimal` to apply decimal precision and optional comma formatting.
 *
 * @param {string | number | undefined} amount - The raw amount to convert.
 * @param {number | undefined} decimal - The number of decimal places the raw amount is based on.
 * @param {number} [decimalDigits] - The number of decimal places to display in the formatted output.
 * @param {boolean} [commify] - Whether to add commas for readability.
 * @returns {string} The formatted human-readable amount.
 *
 * @example
 * amountToHuman(100000000, 6) // "100"
 * amountToHuman("2500000000", 8, 2) // "25.00"
 * amountToHuman(123456789, 6, 4, true) // "123.4567"
 * amountToHuman("5000000", 3, 0, true) // "5,000"
 */
export function amountToHuman(amount: string | number | undefined, decimal: number | undefined, decimalDigits?: number, commify?: boolean): string {
    if (amount === undefined || amount === null || decimal === undefined || decimal === null) {
        return '';
    }

    const rawAmount = String(amount).replace(/,/g, '');
    const sanitizedAmount = isHex(rawAmount)
        ? hexToBn(rawAmount).toString()
        : sciToDecimal(rawAmount);
    const unsignedAmount = sanitizedAmount.startsWith('-') || sanitizedAmount.startsWith('+')
        ? sanitizedAmount.slice(1)
        : sanitizedAmount;
    const digitsOnly = unsignedAmount.replace('.', '');
    const integerLike = digitsOnly.replace(/^0+/, '') || '0';

    const normalized = decimal === 0
        ? integerLike
        : (() => {
            const padded = integerLike.padStart(decimal + 1, '0');
            const splitIndex = padded.length - decimal;

            return `${padded.slice(0, splitIndex)}.${padded.slice(splitIndex)}`;
        })();

    return formatDecimal(normalized, decimalDigits, commify);
}

/**
 * Formats a numeric string for display by truncating its fractional part.
 *
 * - Removes any leading `+`/`-` sign before formatting.
 * - If `commify` is true, it adds commas to the integer part.
 * - If `dynamicDecimal` is true, values between 0 and 1 may keep one more
 *   fractional digit after their leading zeros, up to the internal small-value
 *   threshold.
 * - Integer inputs are returned as integers and are not padded with trailing
 *   decimal zeros.
 *
 * @param {number | string} number - The number to format.
 * @param {number} [decimalDigit=DEFAULT_DECIMAL_POINT_DIGIT] - Maximum number of fractional digits to keep.
 * @param {boolean} [commify] - Whether to add commas to the integer part.
 * @param {boolean} [dynamicDecimal] - Whether to slightly expand precision for some small fractional values.
 * @returns {string} The formatted number as a string.
 *
 * @example
 * formatDecimal(1234.56789, 2); // "1234.56"
 * formatDecimal("0.0001123", 6, false, true); // "0.00011"
 * formatDecimal(-4567.89123, 3, true); // "4,567.891"
 * formatDecimal(1000, 2, true); // "1,000"
 */
export function formatDecimal(number: number | string, decimalDigit: number = DEFAULT_DECIMAL_POINT_DIGIT, commify?: boolean, dynamicDecimal?: boolean): string {
    const MAX_DECIMAL_POINTS = 6;
    const normalizedNumber = sciToDecimal(number);
    const sNumber = normalizedNumber.startsWith('-') || normalizedNumber.startsWith('+')
        ? normalizedNumber.slice(1)
        : normalizedNumber;

    const dotIndex = sNumber.indexOf('.');

    if (dotIndex < 0) {
        return commify ? addThousandsSeparators(sNumber) : sNumber;
    }

    let integerDigits = sNumber.slice(0, dotIndex);

    if (integerDigits === '0' && dynamicDecimal) {
        // Adjust decimal places for very small numbers
        // to show very small numbers such as 0.0000001123
        const leadingZerosInFraction = countLeadingZerosInFraction(sNumber);

        if (leadingZerosInFraction > 0 && leadingZerosInFraction < MAX_DECIMAL_POINTS) {
            decimalDigit = leadingZerosInFraction + 1;
        }
    }

    const fractionalDigits = decimalDigit === 0 ? '' : sNumber.slice(dotIndex, dotIndex + decimalDigit + 1);

    integerDigits = commify ? addThousandsSeparators(integerDigits) : integerDigits;

    return `${integerDigits}${fractionalDigits}`;
}

export function addThousandsSeparators(value: string): string {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Counts the number of leading zeros in the fractional part of a decimal number.
 *
 * @param {string} numStr - The number in string format.
 * @returns {number} The count of leading zeros in the fractional part.
 *
 * @example
 * countLeadingZerosInFraction("0.00045"); // 3
 * countLeadingZerosInFraction("123.0045"); // 2
 * countLeadingZerosInFraction("10.45"); // 0
 * countLeadingZerosInFraction("42"); // 0
 */
export function countLeadingZerosInFraction(numStr: string): number {
    const match = numStr.match(/\.(0+)/);

    if (match) {
        return match[1].length;
    }

    return 0;
}

/**
 * Converts scientific notation to decimal string
 * @param {string|number} value - e.g., "1e-7" or 2.5e-8
 * @returns {string} decimal representation
 */
export function sciToDecimal(value: string | number): string {
    const str = value.toString();

    if (!/e/i.test(str)) {
        return str;
    }

    const [mantissa, exp] = str.split(/e/i);
    const exponent = Number(exp);

    if (!Number.isFinite(exponent)) {
        return str;
    }

    const unsignedMantissa = mantissa.startsWith('-') || mantissa.startsWith('+')
        ? mantissa.slice(1)
        : mantissa;
    const [intPart, fracPart = ''] = unsignedMantissa.split('.');
    const digits = `${intPart}${fracPart}`;
    const decimalIndex = intPart.length + exponent;

    if (decimalIndex <= 0) {
        return `0.${'0'.repeat(Math.abs(decimalIndex))}${digits}`;
    }

    if (decimalIndex >= digits.length) {
        return `${digits}${'0'.repeat(decimalIndex - digits.length)}`;
    }

    return `${digits.slice(0, decimalIndex)}.${digits.slice(decimalIndex)}`;
}

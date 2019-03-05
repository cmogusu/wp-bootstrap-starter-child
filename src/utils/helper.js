import { regex } from "../constants";

/**
 * Convert selection number array into string to be written in editor
 * @param {number[][]} selections
 * @param {string[]} rowHeaders
 * @param {string[]} colHeaders
 */
export function selectionStringBuilder(selections, rowHeaders, colHeaders) {
  let str = "";
  selections.forEach(function(selection) {
    if (selection.length === 2) {
      str += `${colHeaders[selection[1]]}${rowHeaders[selection[0]]},`;
    } else {
      if (selection[0] === selection[2] && selection[1] === selection[3]) {
        str += `${colHeaders[selection[1]]}${rowHeaders[selection[0]]},`;
      } else {
        str += `${colHeaders[selection[1]]}${rowHeaders[selection[0]]}:${
          colHeaders[selection[3]]
        }${rowHeaders[selection[2]]},`;
      }
    }
  });

  return str.slice(0, str.length - 1);
}

/**
 * Detect first non-empty index
 * @param {string[]} data
 * @param {number} start
 * @param {number} unit
 * @param {?number} skipIndex
 */
export function detectNextStop(data, start, unit, skipIndex) {
  let index = start + unit;
  if (skipIndex && skipIndex === index) {
    index += unit;
  }
  let seekData = !!data[start] ? !!data[index] : false;

  while (1) {
    if (unit > 0 ? index >= data.length - 1 : index <= 0) {
      break;
    }
    if (skipIndex && skipIndex === index) {
      index += unit;
      continue;
    }
    if (!!data[index] !== seekData) {
      break;
    }
    index += unit;
  }

  if (seekData && !data[index]) {
    index -= unit;
  }

  return index;
}

/**
 * Parse cell visual string into number array format
 * @param {string} cell - B4 | B4:C5
 * @param {string[]} rowHeaders
 * @param {string[]} colHeaders
 */
export function parseSelection(selection, rowHeaders, colHeaders) {
  const cols = selection.match(/[A-Z]{1,}/g);
  const rows = selection.match(/\d{1,}/g);
  const selectionArray = [];

  if (rows) {
    for (let i = 0; i < rows.length; i++) {
      selectionArray.push(
        rowHeaders.indexOf(parseInt(rows[i])),
        colHeaders.indexOf(cols[i])
      );
    }
    return selectionArray;
  } else {
    return [];
  }
}

/**
 * Add missing closing parentheses
 * @param {string} editorText
 */
export function autoFill(editorText) {
  // Let's ignore +1, we don't need
  const openedParentheses = editorText.split("(").length;
  const closedParentheses = editorText.split(")").length;

  // Add missing closed parenteses.
  return editorText + ")".repeat(openedParentheses - closedParentheses);
}

/**
 * Get active selection array
 * @param {string} editorText
 * @param {number[]} rowHeaders
 * @param {number[]} colHeaders
 */
export function getActiveSelection(editorText, rowHeaders, colHeaders) {
  // It's selectable status, so let's get the first match with confidence
  const strBeforeSelection = editorText.match(regex.beforeSelection)[0];
  const selectionStr = editorText.slice(strBeforeSelection.length);
  const activeSelection = [];

  /** @type {number[]} */
  let tempArray;

  selectionStr.split(",").forEach(selection => {
    tempArray = parseSelection(selection, rowHeaders, colHeaders);
    if (tempArray.length > 0) {
      activeSelection.push(tempArray);
    }
  });
  return {
    strBeforeSelection,
    activeSelection
  };
}

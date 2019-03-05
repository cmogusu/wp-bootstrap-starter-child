import React from "react";
import { HotTable } from "@handsontable-pro/react";

import {
  selectionStringBuilder,
  detectNextStop,
  autoFill,
  getActiveSelection
} from "../utils/helper";
import { regex, table } from "../constants";

class HandsonTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.originValue = "";
    this.editorText = "";
    this.strBeforeSelection = "";
    this.tempValue = null;
    this.isSelectable = false;
    this.activeCell = null;
    this.activeSelection = [];
    this.activeEditor = null;
    this.lastSelection = [];
    this.ongoingSelction = [];
    this.hotSettings = { ...props };
    this.hotTable = React.createRef();
    this.isCtrlKeyDown = false;
    this.isShiftKeyDown = false;
    this.selectionMode = "select";
    this.rowHeaders = null;
    this.colHeaders = null;
    this.totalRows = props.minRows - 1;
    this.totalCols = props.minCols - 1;

    this.onDocumentKeyUp = this.onDocumentKeyUp.bind(this);
    this.parseCellData = this.parseCellData.bind(this);
    this.activateEditor = this.activateEditor.bind(this);
    this.completeEditing = this.completeEditing.bind(this);
    this.handleBeforeKeyDown = this.handleBeforeKeyDown.bind(this);
    this.handleAfterSelection = this.handleAfterSelection.bind(this);
    this.handleBeforeOnCellMouseDown = this.handleBeforeOnCellMouseDown.bind(
      this
    );
    this.handleAfterBeginEditing = this.handleAfterBeginEditing.bind(this);
    this.handleAfterOnCellMouseDown = this.handleAfterOnCellMouseDown.bind(
      this
    );
    this.handleAfterOnCellMouseUp = this.handleAfterOnCellMouseUp.bind(this);
    this.updateColumnHeaders = this.updateColumnHeaders.bind(this);
    this.updateRowHeaders = this.updateRowHeaders.bind(this);
  }

  componentDidMount() {
    const { setHotInstance } = this.props;
    setHotInstance(this.hotTable.current.hotInstance);

    this.ctrlOrMeta = window.navigator.platform.match(/^Mac/);
    this.updateColumnHeaders();
    this.updateRowHeaders();

    document.addEventListener("keyup", this.onDocumentKeyUp);
  }

  componentWillUnmount() {
    document.removeEventListener("keyup", this.onDocumentKeyUp);
  }

  /** @param {KeyboardEvent} ev */
  onDocumentKeyUp(ev) {
    this.isCtrlKeyDown = this.ctrlOrMeta ? ev.metaKey : ev.ctrlKey;
    this.isShiftKeyDown = ev.shiftKey;
  }

  updateColumnHeaders() {
    if (this.hotTable.current) {
      this.colHeaders = this.hotTable.current.hotInstance.getColHeader();
    }
  }

  updateRowHeaders() {
    if (this.hotTable.current) {
      this.rowHeaders = this.hotTable.current.hotInstance.getRowHeader();
    }
  }

  /**
   *
   * @param {number} r1
   * @param {number} c1
   */
  parseCellData(r1, c1) {
    this.activeCell = { r1, c1 };
    this.activeEditor = this.hotTable.current.hotInstance.getActiveEditor();
    this.originValue = this.isEditing ? (
      this.hotTable.current.hotInstance.getSourceDataAtCell(r1, c1) || ""
    ).toUpperCase() : "";

    this.activeEditor.setValue(this.originValue);
    this.editorText = this.originValue;
    this.isSelectable =
      regex.selectable.test(this.editorText) || this.editorText === "=";

    if (this.isSelectable) {
      const { strBeforeSelection, activeSelection } = getActiveSelection(
        this.editorText,
        this.rowHeaders,
        this.colHeaders
      );

      this.strBeforeSelection = strBeforeSelection;
      this.activeSelection = activeSelection;
      this.hotTable.current.hotInstance.selectCells(this.activeSelection);
      this.activateEditor();
    }
  }

  activateEditor() {
    console.log('============')
    try {
      if (!!this.activeCell) {
        this.activeEditor.row = this.activeCell.r1;
        this.activeEditor.col = this.activeCell.c1;
      }
      this.editorText = (
        this.hotTable.current.hotInstance.getSourceDataAtCell(
          this.activeCell.r1,
          this.activeCell.c1
        ) || this.tempValue || ""
      ).toUpperCase();
      const beforeMatches = this.editorText.match(regex.beforeSelection);
      this.strBeforeSelection = beforeMatches ? beforeMatches[0] : "";
      this.editorText =
        this.strBeforeSelection +
        selectionStringBuilder(
          this.activeSelection,
          this.rowHeaders,
          this.colHeaders
        );
      if (this.activeEditor.isOpened()) {
        // Already opened, don't needs any update.
        this.activeEditor.focus();
      } else {
        this.activeEditor.beginEditing();
      }
      this.activeEditor.TEXTAREA.style.width = "auto";
      this.activeEditor.setValue(this.editorText);
      console.log('---coming here')
    } catch (err) {
      console.log(
        "** CANNOT ACTIVATE EDITOR **",
        err,
        "*** Active Editor: ",
        this.activeEditor,
        "*** Active Cell: ",
        this.activeCell
      );
    }
  }

  completeEditing() {
    this.activeEditor.finishEditing();
    this.activeEditor.close();
    this.activeEditor = null;
    this.isEditing = false;
  }

  /** @param {KeyboardEvent} event */
  handleBeforeKeyDown(event) {
    this.isCtrlKeyDown = this.ctrlOrMeta ? event.metaKey : event.ctrlKey;
    this.isShiftKeyDown = event.shiftKey;

    if (["Control", "Shift", "Meta", "Alt"].includes(event.key)) {
      return;
    }

    if (!!this.activeEditor) {
      this.editorText = this.activeEditor.getValue().toUpperCase();
      this.isSelectable =
        regex.selectable.test(this.editorText) || this.editorText === "=";
    }

    this.activeSelection = this.hotTable.current.hotInstance.getSelected();

    switch (true) {
      case event.key === 'F2':
        this.editing = true;
        break;
      case event.key === "Enter":
        if (!!this.activeEditor) {
          event.preventDefault();
          event.stopImmediatePropagation();
          this.activeEditor.setValue(autoFill(this.editorText));
          this.activeCell.r1 += 1;
          this.activeSelection = [[this.activeCell.r1, this.activeCell.c1]];
          this.hotTable.current.hotInstance.selectCells(this.activeSelection);
          this.completeEditing();
        } else {
          this.isEditing = true;
        }
        this.tempValue = null;
        break;
      case event.key === "Escape":
        if (!!this.activeEditor) {
          this.activeEditor.setValue(this.originValue);
          this.completeEditing();
          this.activeSelection = [[this.activeCell.r1, this.activeCell.c1]];
          this.hotTable.current.hotInstance.selectCells(this.activeSelection);
        }
        this.tempValue = null;
        this.isEditing = true;
        break;
      case ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(
        event.key
      ):
        // Fetch out the row/col data of editing cell
        const rowData = this.hotTable.current.hotInstance.getDataAtRow(
          this.lastSelection[2]
        );
        const colData = this.hotTable.current.hotInstance.getDataAtCol(
          this.lastSelection[3]
        );

        // Pop up the last selection to modify
        this.lastSelection = this.activeSelection.pop() || [
          this.activeCell.r1,
          this.activeCell.c1,
          this.activeCell.r1,
          this.activeCell.c1
        ];

        switch (true) {
          case this.isCtrlKeyDown && this.isShiftKeyDown:
            // Expand the last selection to end of the table or data range

            // Prevent default key event handling, we do custom Formula selection.
            event.preventDefault();
            event.stopImmediatePropagation();

            switch (event.key) {
              case "ArrowLeft":
                // Expand the selection to first left non-empty/end
                if (
                  this.lastSelection[1] === 0 ||
                  this.lastSelection[3] === 0
                ) {
                  // Already expended
                  break;
                }
                this.lastSelection[3] = detectNextStop(
                  rowData,
                  this.lastSelection[3],
                  -1,
                  !!this.activeEditor &&
                  this.lastSelection[2] === this.activeCell.r1 &&
                  this.activeCell.c1
                );
                break;
              case "ArrowRight":
                // Expand the selection to first right non-empty/end
                if (
                  this.lastSelection[1] === this.totalCols ||
                  this.lastSelection[3] === this.totalCols
                ) {
                  // Already expended
                  break;
                }
                this.lastSelection[3] = detectNextStop(
                  rowData,
                  this.lastSelection[3],
                  +1,
                  !!this.activeEditor &&
                  this.lastSelection[2] === this.activeCell.r1 &&
                  this.activeCell.c1
                );
                break;
              case "ArrowDown":
                // Expand the selection to first bottom non-empty/end
                if (
                  this.lastSelection[0] === this.totalRows ||
                  this.lastSelection[2] === this.totalRows
                ) {
                  // Already expended
                  break;
                }
                this.lastSelection[2] = detectNextStop(
                  colData,
                  this.lastSelection[2],
                  +1,
                  !!this.activeEditor &&
                  this.lastSelection[3] === this.activeCell.c1 &&
                  this.activeCell.r1
                );
                break;
              case "ArrowUp":
                // Expand the selection to first top non-empty/end
                if (
                  this.lastSelection[0] === 0 ||
                  this.lastSelection[2] === 0
                ) {
                  // Already expended
                  break;
                }
                this.lastSelection[2] = detectNextStop(
                  colData,
                  this.lastSelection[2],
                  -1,
                  !!this.activeEditor &&
                  this.lastSelection[3] === this.activeCell.c1 &&
                  this.activeCell.r1
                );
                break;
              default:
                break;
            }
            break;
          case this.isCtrlKeyDown:
            // Replace the selection to the last non-empty cell or the end of the table.

            // Prevent default key event handling, we do custom Formula selection.
            event.preventDefault();
            event.stopImmediatePropagation();

            this.lastSelection[2] = this.lastSelection[0];
            this.lastSelection[3] = this.lastSelection[1];
            switch (event.key) {
              case "ArrowLeft":
                // Replace to left none-empty/end cell
                this.lastSelection[1] = this.lastSelection[3] = detectNextStop(
                  rowData,
                  this.lastSelection[1],
                  -1,
                  !!this.activeEditor &&
                  this.lastSelection[0] === this.activeCell.r1 &&
                  this.activeCell.c1
                );
                break;
              case "ArrowRight":
                // Replace to right none-empty/end cell
                this.lastSelection[1] = this.lastSelection[3] = detectNextStop(
                  rowData,
                  this.lastSelection[1],
                  +1,
                  !!this.activeEditor &&
                  this.lastSelection[0] === this.activeCell.r1 &&
                  this.activeCell.c1
                );
                break;
              case "ArrowDown":
                // Replace to bottom none-empty/end cell
                this.lastSelection[0] = this.lastSelection[2] = detectNextStop(
                  colData,
                  this.lastSelection[0],
                  +1,
                  !!this.activeEditor &&
                  this.lastSelection[1] === this.activeCell.c1 &&
                  this.activeCell.r1
                );
                break;
              case "ArrowUp":
                // Replace to top none-empty/end cell
                this.lastSelection[0] = this.lastSelection[2] = detectNextStop(
                  colData,
                  this.lastSelection[0],
                  -1,
                  !!this.activeEditor &&
                  this.lastSelection[1] === this.activeCell.c1 &&
                  this.activeCell.r1
                );
                break;
              default:
                break;
            }
            break;
          case this.isShiftKeyDown:
            // Expand last selection

            if (!!this.activeEditor) {
              // Prevent default key event handling, we do custom Formula selection.
              event.preventDefault();
              event.stopImmediatePropagation();

              switch (event.key) {
                case "ArrowLeft":
                  // Expand the selection to left
                  this.lastSelection[3] = Math.max(
                    this.lastSelection[3] - 1,
                    0
                  );
                  break;
                case "ArrowRight":
                  // Expand the selection to right
                  this.lastSelection[3] = Math.min(
                    this.lastSelection[3] + 1,
                    this.totalCols
                  );
                  break;
                case "ArrowDown":
                  // Expand the selection to bottom
                  this.lastSelection[2] = Math.min(
                    this.lastSelection[2] + 1,
                    this.totalRows
                  );
                  break;
                case "ArrowUp":
                  // Expand the selection to top
                  this.lastSelection[2] = Math.max(
                    this.lastSelection[2] - 1,
                    0
                  );
                  break;
                default:
                  break;
              }
            }
            break;
          default:
            if (!!this.activeEditor) {
              // Prevent default key event handling, we do custom Formula selection.
              event.preventDefault();
              event.stopImmediatePropagation();

              // Update lastSelection to (r1, c1) + key
              this.lastSelection[0] += table.rowDiff[event.key];
              this.lastSelection[1] += table.colDiff[event.key];
              this.lastSelection[2] = this.lastSelection[0];
              this.lastSelection[3] = this.lastSelection[1];

              if (!regex.editMode.test(this.editorText)) {
                // Ctrl/Shift key is not pressed, clear active selection and update it to last selection.
                this.activeSelection = [];
                this.activeEditor = null;
                this.activeCell = {
                  r1: this.lastSelection[0],
                  c1: this.lastSelection[1]
                };
              }
            }
            break;
        }

        // Update the selection
        this.activeSelection.push(this.lastSelection.slice(0));
        this.hotTable.current.hotInstance.selectCells(
          this.activeSelection,
          false
        );
        if (!!this.activeEditor) {
          this.activateEditor();
        }
        break;
      default:
        break;
    }
  }

  /**
   *
   * @param {number} r1
   * @param {number} c1
   * @param {number} r2
   * @param {number} c2
   * @param {object} preventScrolling
   * @param {number} selectionLayerLevel
   */
  handleAfterSelection(r1, c1, r2, c2, preventScrolling, selectionLayerLevel) {
    this.lastSelection = [r1, c1, r2, c2];
    this.activeSelection = this.hotTable.current.hotInstance.getSelected();

    if (!!this.activeEditor) {
      this.editorText = this.tempValue || (
        this.hotTable.current.hotInstance.getSourceDataAtCell(
          this.activeCell.r1,
          this.activeCell.c1
        ) || ""
      ).toUpperCase();
      this.isSelectable =
        regex.selectable.test(this.editorText) || this.editorText === "=";
    }
  }

  /**
   *
   * @param {number} r1
   * @param {number} c1
   */
  handleAfterBeginEditing(r1, c1) {
    if (!this.activeEditor) {
      this.parseCellData(r1, c1);
    }
  }

  handleBeforeOnCellMouseDown(event, coords, TD, controller) {
    if (!!this.activeEditor) {
      this.editorText = this.activeEditor.getValue();
      this.tempValue = this.editorText;
      this.hotTable.current.hotInstance.setDataAtCell(
        this.activeCell.r1,
        this.activeCell.c1,
        ""
      );
    }
  }

  /**
   *
   * @param {MouseEvent} event
   * @param {object} coords
   * @param {Element} TD
   */
  handleAfterOnCellMouseDown(event, coords, TD) {
    this.ongoingSelction[0] = coords.row;
    this.ongoingSelction[1] = coords.col;
    this.ongoingSelction[2] = coords.row;
    this.ongoingSelction[3] = coords.col;

    if (!!this.activeEditor) {
      this.isSelectable =
        regex.selectable.test(this.editorText) || this.editorText === "=";

      if (!this.isSelectable) {
        this.activeEditor.setValue(this.originValue);
        this.completeEditing();
        console.log("============ Complete Editing ============");
        return;
      }
    }

    switch (true) {
      case this.isCtrlKeyDown:
        // Ctrl Key is down, add new selection to existing one
        this.activeSelection.push(this.ongoingSelction.slice(0));
        break;
      case this.isShiftKeyDown:
        // Needs to rewrie last selection.
        break;
      default:
        this.activeSelection = [this.ongoingSelction.slice(0)];
        break;
    }
    this.selectionMode = "replace";
  }

  /**
   *
   * @param {MouseEvent} event
   * @param {object} coords
   * @param {Element} TD
   */
  handleAfterOnCellMouseUp(event, coords, TD) {
    this.selectionMode = "waiting";

    if (!!this.activeEditor) {
      if (this.tempValue) {

      }
      this.activateEditor();
    }
  }

  render() {
    return (
      <HotTable
        ref={this.hotTable}
        settings={this.hotSettings}
        beforeKeyDown={this.handleBeforeKeyDown}
        afterSelection={this.handleAfterSelection}
        afterBeginEditing={this.handleAfterBeginEditing}
        beforeOnCellMouseDown={this.handleBeforeOnCellMouseDown}
        afterOnCellMouseDown={this.handleAfterOnCellMouseDown}
        afterOnCellMouseUp={this.handleAfterOnCellMouseUp}
        afterCreateCol={this.updateColumnHeaders}
        afterRemoveCol={this.updateColumnHeaders}
        afterCreateRow={this.updateRowHeaders}
        afterRemoveRow={this.updateRowHeaders}
      />
    );
  }
}

HandsonTable.defaultProps = {
  id: "hot",
  licenseKey: "00000-00000-00000-00000-00000",
  data: [[]],
  minRows: 10,
  minCols: 26,
  colHeaders: true,
  rowHeaders: true,
  contextMenu: true,
  minSpareRows: 1,
  minSpareCols: 1,
  manualColumnResize: true,
  formulas: true,
  selectionMode: "multiple",
  stretchH: "all",
  setHotInstance: () => {},
};

export default HandsonTable;

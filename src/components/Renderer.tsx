import { GridCellProps, GridRowProps } from "@progress/kendo-react-grid";
import * as React from "react";
import { IBulkUserGrid, IFileRecordDetail } from "./interface";
import { MyChipListTest } from "./CustomCells/ChipCell";

interface CellRenderProps {
    originalProps: GridCellProps;
    td: React.ReactElement<HTMLTableCellElement>;
    enterEdit: (dataItem: IBulkUserGrid, field: string | undefined) => void;
    editField: string;
}

interface RowRenderProps {
    originalProps: GridRowProps;
    tr: React.ReactElement<HTMLTableRowElement>;
    exitEdit: () => void;
    editField: string;
}

export const CellRender = (props: CellRenderProps) => {
    const { originalProps, editField, enterEdit, td } = props;
    const { dataItem, field } = originalProps;

    const handleCellClick = () => {
        enterEdit(dataItem, field);
    };

    const isCellInEdit = dataItem[editField] === field;
    const additionalProps = isCellInEdit
        ? { ref: handleRef }
        : { onClick: handleCellClick };

    function handleRef(td: HTMLTableCellElement) {
        const input = td?.querySelector("input");
        if (!input) return;

        input.classList.add("selected-cell");
        const activeElement = document.activeElement;

        if (
            !activeElement ||
            input === activeElement ||
            !activeElement.contains(input)
        ) {
            return;
        }

        if (input.type === "checkbox") {
            input.focus();
        } else {
            input.select();
        }
    }

    // If the cell has error message, apply the class
    // const customClassName = "selected-cell";
    const customClassName = "";

    const fileRecordDetail = dataItem.fileRecordDetail as IFileRecordDetail[];

    if (field === "fileRecordDetail.AddSF" && dataItem) {
        const addSF = fileRecordDetail
            .filter((item) => item.addSF !== null)
            .map((item) => {
                return {
                    id: item.id,
                    fileRecordId: item.fileRecordId,
                    field: "addSF",
                    value: item.addSF as string,
                };
            });
        return <MyChipListTest data={addSF} className={customClassName} />;
    }

    if (field === "fileRecordDetail.RemoveSF" && dataItem) {
        const addSF = fileRecordDetail
            .filter((item) => item.removeSF !== null)
            .map((item) => {
                return {
                    id: item.id,
                    fileRecordId: item.fileRecordId,
                    field: "removeSF",
                    value: item.removeSF as string,
                };
            });
        // console.log(addSF);
        return <MyChipListTest data={addSF} className={customClassName} />;
    }

    return React.cloneElement(td, {
        ...td.props,
        ...additionalProps,
        className: customClassName,
    });
};

export const RowRender = (props: RowRenderProps) => {
    const trProps = {
        ...props.tr.props,
        onBlur: () => {
            props.exitEdit();
        },
    };

    return React.cloneElement(
        props.tr,
        { ...trProps, className: `row__${props.originalProps.dataItem.id}` },
        props.tr.props.children as React.ReactNode
    );
};

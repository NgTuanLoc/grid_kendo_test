import { useState } from "react";
import {
    Grid,
    GridColumn,
    GridToolbar,
    GridItemChangeEvent,
    GridCellProps,
    GridRowProps,
} from "@progress/kendo-react-grid";
import { Button } from "@progress/kendo-react-buttons";
import { CellRender, RowRender } from "./Renderer";
import { IBulkUserGrid } from "./interface";
import { GridColumnType, useBulkUserGridContext } from "../context";
import { generateDummyData } from "../utils";

const EDIT_FIELD = "inEdit";

const dummyUserData = generateDummyData(107);

const MyGrid = () => {
    const { gridRef, navigateCellTo, page, pageChange, pageSizeValue } =
        useBulkUserGridContext();
    const [data, setData] = useState<IBulkUserGrid[]>(dummyUserData);
    const [changes, setChanges] = useState<boolean>(false);

    // Edit
    const enterEdit = (dataItem: IBulkUserGrid, field: string | undefined) => {
        const newData = data.map((item) => ({
            ...item,
            [EDIT_FIELD]: item.id === dataItem.id ? field : undefined,
        }));

        setData(newData);
    };

    const exitEdit = () => {
        const newData = data.map((item) => ({
            ...item,
            [EDIT_FIELD]: undefined,
        }));

        setData(newData);
    };

    const saveChanges = () => {
        // products.splice(0, products.length, ...data);
        setChanges(false);
    };

    const cancelChanges = () => {
        setData(dummyUserData);
        setChanges(false);
    };

    const itemChange = (event: GridItemChangeEvent) => {
        console.log(event.field);
        const field = event.field as GridColumnType;
        // const field = event.field || "";
        event.dataItem[field] = event.value;
        const newData = data.map((item) => {
            if (item.id === event.dataItem.id) {
                if (field === "localAccount") {
                    item[field] = Boolean(event.value);
                } else {
                    item[field] = event.value;
                }
            }
            return item;
        });
        setData(newData);
        setChanges(true);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customCellRender: any = (
        td: React.ReactElement<HTMLTableCellElement>,
        props: GridCellProps
    ) => (
        <CellRender
            originalProps={props}
            td={td}
            enterEdit={enterEdit}
            editField={EDIT_FIELD}
        />
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const customRowRender: any = (
        tr: React.ReactElement<HTMLTableRowElement>,
        props: GridRowProps
    ) => (
        <RowRender
            originalProps={props}
            tr={tr}
            exitEdit={exitEdit}
            editField={EDIT_FIELD}
        />
    );

    return (
        <div>
            <div>
                <span style={{ marginRight: 10 }}>
                    Scroll to row with index (it is zero based):
                </span>
                <Button
                    style={{ marginRight: 5 }}
                    onClick={() => navigateCellTo(1)}
                >
                    1
                </Button>
                <Button
                    style={{ marginRight: 5 }}
                    onClick={() => navigateCellTo(5)}
                >
                    5
                </Button>
                <Button
                    style={{ marginRight: 5 }}
                    onClick={() => navigateCellTo(10)}
                >
                    10
                </Button>
                <Button
                    style={{ marginRight: 5 }}
                    onClick={() => navigateCellTo(11)}
                >
                    11
                </Button>
                <Button
                    style={{ marginRight: 5 }}
                    onClick={() => navigateCellTo(20)}
                >
                    20
                </Button>
                <Button
                    style={{ marginRight: 5 }}
                    onClick={() => navigateCellTo(70)}
                >
                    70
                </Button>
            </div>
            <br />
            <div ref={gridRef}>
                <Grid
                    data={data.slice(page.skip, page.take + page.skip)}
                    skip={page.skip}
                    take={page.take}
                    total={dummyUserData.length}
                    pageable={{
                        buttonCount: 4,
                        pageSizes: [5, 10, 15, "All"],
                        pageSizeValue: pageSizeValue,
                    }}
                    onPageChange={pageChange}
                    style={{
                        height: "400px",
                        overflowY: "auto",
                        overflowX: "hidden",
                    }}
                    rowHeight={30}
                    dataItemKey={"ProductID"}
                    onItemChange={itemChange}
                    cellRender={customCellRender}
                    rowRender={customRowRender}
                    editField={EDIT_FIELD}
                >
                    <GridToolbar>
                        <button
                            title="Save Changes"
                            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                            onClick={saveChanges}
                            disabled={!changes}
                        >
                            Save Changes
                        </button>
                        <button
                            title="Cancel Changes"
                            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                            onClick={cancelChanges}
                            disabled={!changes}
                        >
                            Cancel Changes
                        </button>
                    </GridToolbar>
                    <GridColumn
                        field="id"
                        title="Id"
                        width="50px"
                        editable={false}
                    />
                    <GridColumn field="email" title="Email" width="200px" />
                    <GridColumn
                        field="displayName"
                        title="Display Name"
                        width="200px"
                    />
                    <GridColumn
                        field="firstName"
                        title="First Name"
                        width="200px"
                    />
                    <GridColumn
                        field="lastName"
                        title="Last Name"
                        width="200px"
                    />
                    <GridColumn
                        field="licensedSolutions"
                        title="Licensed Solutions"
                        width="200px"
                    />
                    <GridColumn
                        title="Local Account"
                        field="localAccount"
                        width="200px"
                        editor="boolean"
                    />
                    <GridColumn
                        title="Hierarchy"
                        field="hierarchy"
                        width="200px"
                    />
                    <GridColumn field="roles" title="Roles" width="200px" />
                </Grid>
            </div>
        </div>
    );
};

export default MyGrid;

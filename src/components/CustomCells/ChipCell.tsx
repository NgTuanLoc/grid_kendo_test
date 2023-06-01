import {
    ChipList,
    Chip,
    ChipProps,
    ChipRemoveEvent,
} from "@progress/kendo-react-buttons";
import { IBulkUserGrid } from "../interface";
import { convertToChipValue } from "../../utils";
import { useBulkUserGridContext } from "../../context";

interface IMyChipList {
    data: IBulkUserGrid;
    className?: string;
}

export const MyChipList = ({ data, className }: IMyChipList) => {
    const { removeSolutionFamilyHandler } = useBulkUserGridContext();
    const onRemoveHandler = (event: ChipRemoveEvent) => {
        const value = event.target.props.value;
        removeSolutionFamilyHandler(data.id, value);
    };

    const chipValue = convertToChipValue(data?.licensedSolutions);

    return (
        <td className={className}>
            <ChipList
                selection="single"
                data={chipValue}
                chip={(props: ChipProps) => (
                    <Chip
                        onRemove={onRemoveHandler}
                        removable={chipValue.length !== 1}
                        {...props}
                    />
                )}
            />
        </td>
    );
};

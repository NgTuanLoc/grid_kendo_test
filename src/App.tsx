import { Button } from "@progress/kendo-react-buttons";
import LocGrid from "./components/Grid";
import { useBulkUserGridContext } from "./context";

function App() {
    const { onSubmitHandler } = useBulkUserGridContext();

    return (
        <div>
            <LocGrid />
            <Button onClick={onSubmitHandler}>Submit</Button>
        </div>
    );
}

export default App;

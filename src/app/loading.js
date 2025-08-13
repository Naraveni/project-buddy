import { SyncLoader } from "react-spinners";

export default function loader(){
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
    <SyncLoader />
    </div>
)
}

import { IFPSSystem } from "./IFPSSystem";
import { OrbitDbSystem } from "./OrbitDbSystem";

export function Systems() {

    return (
        <>
            <IFPSSystem />
            <OrbitDbSystem />
        </>
    );
}

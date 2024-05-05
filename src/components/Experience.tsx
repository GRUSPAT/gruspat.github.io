import { OrbitControls, RoundedBox, Text} from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

export const Experience = () => {
    return (
        <>
            <OrbitControls />
            <Text position-x={-1.3} position-y={0} position-z={1} lineHeight={0.8}>
                PATRYK{"\n"}GRUSZOWSKI
                <meshBasicMaterial color="black"/>
            </Text>
            <group rotation-y={degToRad(-30)} position-y={0}>
            <RoundedBox args={[2,2,1]} radius={0.28} position-x={5}>
                <meshBasicMaterial color="orange"/>
            </RoundedBox>
            <RoundedBox args={[2,2,1]} radius={0.28} position-x={8}>
                <meshBasicMaterial color="green"/>
            </RoundedBox>
            <RoundedBox args={[2,2,1]} radius={0.28} position-x={11}>
                <meshBasicMaterial color="red"/>
            </RoundedBox>
            </group>
        </>
    );
};

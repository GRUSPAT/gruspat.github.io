import { Bwa } from "../convertedModels/Bwa"
import { Hoodie } from "../convertedModels/Hoodie";
import { Mgmg } from "../convertedModels/Mgmg"

interface tileData {
    name: string;
    description: string;
    backgroundTexture: string;
    positionX: number;
    children: React.ReactNode;
}

const TileData: tileData[] = [
    {
        name: "TARNOW 1000",
        description: "Explore Tarnow;follow themed paths;or make your own with;this app full of;interesting places",
        backgroundTexture: "textures/bwa_background_texture.png",
        positionX: -1.7,
        children: <Bwa scale={4.6} position-y={-0.58} position-x={-0.6}/>
    },
    {
        name: "SMART HOODIE",
        description: "Embedded device with;multiple sensors and;heating capability;integrated with;dedicated mobile app",
        backgroundTexture: "textures/hoodie_background_texture.png",
        positionX: 0,
        children:  <Hoodie scale={0.3} position-y={-0.5} position-z={-0.5}/>
    },
    {
        name: "MGMG",
        description: "Join with your friend;and compete in multiple;mini games with limited;time",
        backgroundTexture: "textures/mgmg_background_texture.png",
        positionX: 1.7,
        children: <Mgmg position-y={-0.8} scale={0.25} position-z={0.30} position-x={-0.50}/>
    }
];

export default TileData;
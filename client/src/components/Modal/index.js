import {motion, animate, useMotionTemplate, useMotionValue} from "framer-motion";
import Backdrop from "../Backdrop";
import moon from "./moon.png";
import sun from "./sun.png";
import sea from "./sea.png"

const dropIn = {
    hidden:{
        y: "-100vh",
    },
    visible:{
        y: "0",
        opacity:20,
        transision:{
            duration:0.1,
            type: "spring",
            damping:25,
            stiffness:500,
        }
    },
    exit:{
        y: "100vh",
    },
}

const Modal = ({handleClose, text}) => {
    const primary = useMotionValue('248, 236, 236');
const background = useMotionTemplate`linear-gradient(${primary},rgb(14, 15, 14))`;


function defaultTheme(e){
    const color = e.currentTarget.getAttribute('data-color');

    const root = document.querySelector(".App");
    root.style.backgroundColor =` #1d1c1c`

    animate(primary, color, { duration: 1 })
}

function whiteTheme(e){
    const color = e.currentTarget.getAttribute('data-color')

    const root = document.querySelector(".App")
    root.style.backgroundColor =`rgb(255, 255, 255)`

    animate(primary, color, { duration: 1 })
}

function uniqueTheme(e){
    const color = e.currentTarget.getAttribute('data-color')

    const root = document.querySelector(".App")
    root.style.backgroundColor =`rgb(29, 47, 212)`

    animate(primary, color, { duration: 1 })
}

    return(
        <Backdrop onClick = {handleClose}>
            <motion.div
            onClick = {(e) => e.stopPropagation()}
            className = "modal"
            variants = {dropIn}
            initial = "hidden"
            animate = "visible"
            exit = "exit"
            style = {{background}}
            >
                <div className="themeWrapper" style = {{background}}>
                <h1>Change your theme</h1>
                <div className = 'themeList' style = {{background}}>
                    <button id = "dark" onClick = {defaultTheme}
                    data-color='#000000'>
                        <motion.img id = "moon"
                        src = {moon}
                        whileHover = {{scale:1.2}}
                        whileTap = {{scale:0.9}}/>
                        </button>
                    <button id = "white" onClick = {whiteTheme}
                    data-color='rgb(255, 255, 255)'>
                        <motion.img id = "sun"
                        src = {sun}
                        whileHover = {{scale:1.2}}
                        whileTap = {{scale:0.9}} />
                    </button>
                    <button id = "blue" onClick = {uniqueTheme}
                    data-color='rgb(29, 47, 212)'>
                    <motion.img id = "sea"
                    src = {sea}
                    whileHover = {{scale:1.2}}
                    whileTap = {{scale:0.9}} />
                    </button>
                </div>
                </div>
            </motion.div>
        </Backdrop>
    )
}

export default Modal;
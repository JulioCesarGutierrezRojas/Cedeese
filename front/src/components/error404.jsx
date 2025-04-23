import { motion } from "framer-motion";
import errorImg from "../assets/error404.png";

export default function Error404() {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-white text-center px-4">
            <div className="w-32 md:w-48 mb-4">
                <motion.img
                    src={errorImg}
                    alt="404"
                    className="w-full h-auto"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                />
            </div>
            <motion.h1
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-3"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                404 - Página no encontrada
            </motion.h1>
            <motion.p
                className="text-gray-600 text-base max-w-md"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                Lo que buscas no está disponible... o ya fue devorado por bugs.
            </motion.p>
        </div>
    );
}

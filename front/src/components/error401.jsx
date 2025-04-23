import { motion } from "framer-motion";

export default function Error401() {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-950 text-center px-4">
            <motion.img
                src="src/assets/error401.png"
                alt="401"
                className="w-52 md:w-72 mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            />
            <motion.h1
                className="text-white text-4xl md:text-5xl font-bold mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >401 - No autorizado
            </motion.h1>

        </div>
    );
}

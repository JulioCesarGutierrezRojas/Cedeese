import { motion } from "framer-motion";

export default function Error403() {
    return (
        <div className="h-screen w-screen flex items-center justify-center bg-gray-950 text-center px-4">
            <motion.img
                src="src/assets/error403.png"
                alt="403"
                className="w-52 md:w-72 mb-5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            />
            <motion.h1
                className="text-white text-2xl md:text-3xl font-bold mb-4" // Texto más pequeño
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >403 - Acceso Denegado
            </motion.h1>
        </div>
    );
}

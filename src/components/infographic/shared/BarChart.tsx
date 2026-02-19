import { motion } from "framer-motion";

interface DataPoint {
  label: string;
  value: number;
  type?: "improve" | "worsen"; // For sentiment chart
}

interface BarChartProps {
  data: DataPoint[];
  variant?: "sentiment" | "country";
  height?: number;
}

const BarChart = ({ data, variant = "sentiment", height = 300 }: BarChartProps) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full flex items-end justify-between gap-2" style={{ height }}>
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group">
          
          <div className="relative w-full flex-1 flex items-end justify-center">
             <motion.div
              initial={{ height: 0, opacity: 0 }}
              whileInView={{ height: `${(item.value / maxValue) * 100}%`, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ 
                type: "spring", 
                stiffness: 200, 
                damping: 20, 
                delay: index * 0.1 
              }}
              className={`w-full max-w-[40px] rounded-t-lg relative overflow-hidden ${
                variant === "sentiment" 
                  ? item.type === "improve" ? "bg-emerald-500" : "bg-red-500"
                  : "bg-indigo-500"
              }`}
            >
              <div className="absolute top-2 left-0 right-0 text-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                {item.value}%
              </div>
            </motion.div>
          </div>

          <div className="mt-3 text-xs text-center text-slate-500 font-medium h-8 flex items-center justify-center">
            {item.label.split(" ").map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default BarChart;

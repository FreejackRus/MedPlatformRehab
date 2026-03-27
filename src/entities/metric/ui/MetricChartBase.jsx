import { chartLabels } from "../../rehab/model/constants.js";

function MetricChart({ metric }) {
  return (
    <div className="chart">
      {metric.values.map((value, index) => (
        <div key={chartLabels[index]} className="bar-column">
          <span>{chartLabels[index]}</span>
          <i style={{ height: `${Math.max((value / metric.max) * 100, 14)}%` }} />
          <strong>
            {value}
            {metric.suffix}
          </strong>
        </div>
      ))}
    </div>
  );
}

export default MetricChart;

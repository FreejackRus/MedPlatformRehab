import { useParams } from "react-router-dom";
import DoctorWorkspace from "../../widgets/doctor-workspace/index.jsx";

function DoctorPage(props) {
  const { screen = "overview" } = useParams();

  return <DoctorWorkspace {...props} screen={screen} />;
}

export default DoctorPage;

import EquipmentList from "../components/equipment/EquipmentList";

const HomePage = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">備品一覧</h1>
      <EquipmentList />
    </div>
  );
};
export default HomePage;

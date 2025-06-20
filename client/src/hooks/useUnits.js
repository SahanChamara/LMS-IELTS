import { useDispatch } from "react-redux"
import { useAppSelector } from "../redux/store-config/store";
import { getAllUnitsAPI, getCourseIdAPI, getUnitBytIdAPI } from "../redux/features/unitsSlice";



export const useUnits = () => {
    const dispatch = useDispatch();
    const {loading, units, error} = useAppSelector((state) => state.units);
    console.log("use unit jsx file units", units.data);
    

    const getAllUnits = () => dispatch(getAllUnitsAPI());
    // const addNewUnit = (unit) => dispatch()
    const getCourseId = () => dispatch(getCourseIdAPI());
    const getUnitById = (id) => dispatch(getUnitBytIdAPI(id));


    return {
        allunits:units,
        loading,
        error,
        getAllUnits,
        getCourseId,
        getUnitById,
    };
};
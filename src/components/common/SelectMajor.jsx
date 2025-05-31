import React, { useEffect, useState } from "react";
import { Select, MenuItem } from "@mui/material";
import { list } from "../../utils/api/major";

function SelectMajor({ value, setValue, disabled = false }) {
  const [listMajor, setListMajor] = useState([]);

  useEffect(() => {
    const getListMajor = async () => {
      try {
        const res = await list();
        setListMajor(res.data?.filter((i) => i.isBlock > 0));
      } catch (error) {
        throw error;
      }
    };
    getListMajor();
  }, []);

  useEffect(() => {
    if (!value) {
      setValue && setValue(listMajor[0]?._id);
    }
  }, [listMajor]);

  return (
    <>
      <Select
        label="Chuyên ngành"
        fullWidth
        size="small"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      >
        {listMajor?.map((e) => (
          <MenuItem value={e._id} key={e._id}>
            {e?.name}
          </MenuItem>
        ))}
      </Select>
    </>
  );
}

export default SelectMajor;

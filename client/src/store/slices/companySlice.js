import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
  name: "company",
  initialState: {
    singleCompany: null,
    companies: [],
  },
  reducers: {
    setSingleCompany: (state, action) => {
      state.singleCompany = action.payload;
    },
    setCompanies: (state, action) => {
      state.companies = action.payload;
    },
    removeCompany: (state, action) => {
      state.companies = state.companies.filter(company => company._id !== action.payload);
    },
  },
});

export const { setSingleCompany, setCompanies,removeCompany } = companySlice.actions;
export default companySlice.reducer;

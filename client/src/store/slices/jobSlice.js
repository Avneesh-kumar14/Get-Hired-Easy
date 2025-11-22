import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    singleJob: null,
    allAdminJobs: [],
    allAppliedJobs: [],
    allSearchedJobs: [],
    searchedQuery: "",
  },
  reducers: {
    getAllJobs: (state, action) => {
      state.jobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
    setAllSearchedJobs: (state, action) => {
      state.allSearchedJobs = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchedQuery = action.payload;
    },
    removeCompanyJobs: (state, action) => {
      const companyId = action.payload;
      state.jobs = state.jobs.filter((job) => job.company !== companyId);
      state.allAdminJobs = state.allAdminJobs.filter(
        (job) => job.company !== companyId
      );
      state.allSearchedJobs = state.allSearchedJobs.filter(
        (job) => job.company !== companyId
      );
      state.allAppliedJobs = state.allAppliedJobs.filter(
        (job) => job.company !== companyId
      );
      if (state.singleJob?.company === companyId) {
        state.singleJob = null;
      }
    },
  },
});

export const {
  getAllJobs,
  setSingleJob,
  setAllAdminJobs,
  setAllAppliedJobs,
  setSearchedQuery,
  setAllSearchedJobs,
  removeCompanyJobs,
} = jobSlice.actions;

export default jobSlice.reducer;

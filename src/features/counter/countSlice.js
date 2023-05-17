import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";

const spreadsheetId = process.env.REACT_APP_GOOGLE_SPREADSHHET_ID;
const restBaseUrl = process.env.REACT_APP_REST_BASE_URL;

export const fetchCount = createAsyncThunk("count/fetchCount", async () => {
  const response = await fetch(
    `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json`
  );
  const result = await response.text();
  const data = JSON.parse(
    result.replace(/.*google.visualization.Query.setResponse\({(.*?)}\);?/s, "{$1}")
  );

  const count = data.table.rows[0].c[0].v;
  //console.log(count);
  return count;
});

export const updateCount = createAsyncThunk("count/updateCount", async (_, thunkAPI) => {
  const count = thunkAPI.getState().count;

  const url = `${restBaseUrl}restapi-php/app/reduxState/serverState.php`;
  const data = {
    values: count.value,
  };
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(data),
  });
  const result = await response.json();
  //console.log(result);
  return result;
});

const initialState = {
  value: 0,
};

const countSlice = createSlice({
  initialState,
  name: "count",
  reducers: {
    add: (state, action) => {
      state.value += action.payload;
    },
    sub: (state, action) => {
      state.value -= action.payload;
    },
    reset: (state) => {
      state.value = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCount.pending, (state, action) => {
        //console.log("Pending", { action });
      })
      .addCase(fetchCount.fulfilled, (state, action) => {
        //console.log("Fetched Successfully!", { action });
        state.value = action.payload;
      });
  },
});

const { actions } = countSlice;

export const { add, sub, reset } = actions;

export default countSlice.reducer;

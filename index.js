const express = require('express'); 
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const app = express(); 
const PORT = 3000; 
app.set("view engine" , "ejs")

app.use(express.urlencoded({ extended: true}));
app.use(express.static("public"))
app.use(bodyParser.json());
const auth = new google.auth.GoogleAuth({
	keyFile: "third-wharf-405222-475a4da34fbe.json", //the key file
	//url to spreadsheets API
	scopes: "https://www.googleapis.com/auth/spreadsheets", 
});

 async function getDataFromSheet() {
	const authClientObject = await auth.getClient();
	const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });
	const spreadsheetId = "1O709o2MEknaAvRK_iveTHML4hOLZ2Zse3IpZI1KKrN4";
	
try {
const response = await googleSheetsInstance
.spreadsheets.values.get({

spreadsheetId,

range: "Sheet1"
});
return response.data.values.slice(1);

} catch (error) {
  
console.error("Error fetching data:", error);
return [];
}
}

app.get("/", async (req, res) => {

const data = await getDataFromSheet();

res.render("index", {data });
});

app.get("/create", (req, res) => {

res.render("create");

});

app.post("/create", async (req, res) => {

	const  {x1,x2,x3,x4,x5,x6,x7,x8,x9,x10,x11,x12,x13,x14} = req.body;
	const authClientObject = await auth.getClient();
	const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });
	const spreadsheetId = "1O709o2MEknaAvRK_iveTHML4hOLZ2Zse3IpZI1KKrN4";
try {

await googleSheetsInstance.spreadsheets.values.append({

spreadsheetId,

range: "Sheet1",

valueInputOption: "USER_ENTERED",

resource: { values: [
	[x1,x2,x3,x4,x5,x6,x7,x8,x9,x10,x11,x12,x13,x14]
] }
});
res.redirect("/");

} catch (error) {

console.error("Error creating data:", error);

res.redirect("/");
}
});

app.get("/edit/:id", async (req, res) => {

const data = await getDataFromSheet();
const id = parseInt(req.params.id);
const item = data[id - 1]; 

res.render("edit", { item, id });

});

app.post("/edit/:id", async (req, res) => {
	const authClientObject = await auth.getClient();
	const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });
	const spreadsheetId = "1O709o2MEknaAvRK_iveTHML4hOLZ2Zse3IpZI1KKrN4";

const id = parseInt(req.params.id);
const  {x1,x2,x3,x4,x5,x6,x7,x8,x9,x10,x11,x12,x13,x14} = req.body;

try {

await googleSheetsInstance.spreadsheets.values.update({

spreadsheetId,

range: `Sheet1!A${id + 1}:N${id + 1}`, // Assuming ID starts

valueInputOption: "USER_ENTERED",

resource: { values: [
	[x1,x2,x3,x4,x5,x6,x7,x8,x9,x10,x11,x12,x13,x14]
] }

});

res.redirect("/");

} catch (error) {

console.error("Scroll for detaingg data:", error);
res.redirect("/");
}
});


app.get("/delete/:id", async (req, res) => {
	const authClientObject = await auth.getClient();
	const googleSheetsInstance = google.sheets({ version: "v4", auth: authClientObject });
	const spreadsheetId = "1O709o2MEknaAvRK_iveTHML4hOLZ2Zse3IpZI1KKrN4";
const id = parseInt(req.params.id);

try {
await googleSheetsInstance.spreadsheets.values.clear({

spreadsheetId,

range: `Sheet1!A${id + 1}:O${id + 1}` 
});
res.redirect("/");
} catch (error) {

console.error("Error deleting data:", error);

res.redirect("/");
}

});



app.listen(PORT, (error) =>{ 
	if(!error)  {
		console.log("Server is Successfully Runninand App is listening on port "+ PORT) 
	}else {
		console.log("Error occurred, server can't start", error); 
	} 
	}
); 


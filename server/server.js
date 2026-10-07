const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("FIXA AI SERVER ONLINE");
});

app.post("/command", async (req, res) => {

    const command = req.body.command;

    if (!command) {
        return res.json({
            success: false,
            reply: "Command नहीं मिली।"
        });
    }

    console.log("FIXA COMMAND:", command);

    // अभी temporary AI response
    res.json({
        success: true,
        reply:
            `मैंने आपकी command समझ ली: "${command}"`
    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `FIXA server running on port ${PORT}`
    );
});

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { db } = require("../database/models");
const qs = require("qs");
const { _ } = require("lodash");

function compactAndUniq(array) {
  return _.compact(_.uniq(array));
}

// This function is to read the data stored in YAML
// format through RoR application
// convert YAML data to  plain text
function serializeData(data) {
  const yaml = require("js-yaml");
  return yaml.dump(data);
}
//convert plain data to  YAML
function deserializeData(data) {
  const yaml = require("js-yaml");
  return yaml.load(data);
}
function printParams(req) {
  let body = qs.parse(req.body);
  let params = qs.parse(req.params);
  let query = qs.parse(req.query);

  console.log("*****headers", req.headers);
  // console.log("*****body", body);
  // console.log("*****params", params);
  // console.log("*****query", query);
}
const cryptPassword = (password, callback) => {
  var saltRounds = 10;
  return bcrypt
    .genSalt(saltRounds)
    .then((salt) => {
      // console.log('Salt: ', salt)
      return bcrypt.hash(password, salt);
    })
    .then((hash) => {
      // console.log('Hash: ', hash)
      return hash;
    })
    .catch((err) => console.error(err.message));
};

const comparePassword = async (plainPass, hashword, callback) => {
  return bcrypt
    .compare(plainPass, hashword)
    .then((res) => {
      return res; // return true
    })
    .catch((err) => console.error(err.message));
};

const getCurrentUser = async (token) => {
  console.log("Current User Method");
  const { db } = require("../database/models");

  if (!token) {
    throw new Error("Token is not provided");
  }
  var decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log("User Id: ", decoded);
  let user = await db.User.findOne({ where: { id: decoded.userId } });
  return user;
};

function validUrl(url) {
  const { URL } = require("url");
  console.log("****** validUrl");
  try {
    const parsedUrl = new URL(url);
    return (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") && parsedUrl.hostname !== null;
  } catch (error) {
    return false;
  }
}

async function addAttachment(params, resource) {
  const { db } = require("../database/models");
  const { validUrl } = require("./helpers");

  var recordType = resource.constructor.name;
  var linkFiles = params.file_links;
  var blobName = "";
  var attachmentFiles = [];
  console.log("PARAMS: ");
  if (recordType == "Task") {
    //attachmentFiles = params.task.task_files;
    blobName = "task_files";
  } else if (recordType == "Issue") {
    // attachmentFiles = params.issue.issue_files;
    blobName = "issue_files";
  } else if (recordType == "Risk") {
    attachmentFiles = params.risk.risk_files;
    blobName = "risk_files";
  } else if (recordType == "Lesson") {
    attachmentFiles = params.lesson.lesson_files;
    blobName = "lesson_files";
  }

  if (linkFiles && linkFiles.length > 0) {
    for (var f of linkFiles) {
      if (f && validUrl.isUri(f)) {
        let filename = f;
        if (f.length > 252) {
          filename = f.substring(0, 252) + "...";
        }
        // `key`, `filename`, `content_type`, `metadata`, `byte_size`, `checksum`, `created_at`, `service_name`
        var blob = await db.ActiveStorageBlob.create({
          // Assuming taskFiles is a Sequelize attachment association
          key: db.ActiveStorageBlob.generateRandomAlphaNumericString(),
          name: blobName,
          record_type: recordType,
          record_id: resource.id,
          filename: filename,
          content_type: "text/plain",
          service_name: "local",
          metadata: "",
          byte_size: filename.length,
          checksum: "",
        });
      }
    }
  }

  if (attachmentFiles && attachmentFiles.length > 0) {
    // Using Stream in nodejs
    const fs = require("fs");
    const path = require("path");

    const rootDir = path.resolve(__dirname, "..", "..", "uploads");

    console.log("******Current directory:", rootDir);

    for await (const file of attachmentFiles) {
      const passThroughStream = file.stream;

      // upload and save the file
      // var writerStream = fs.createWriteStream(`./uploads/${part.originalName}`);
      var file_key = db.ActiveStorageBlob.generateRandomAlphaNumericString();

      var blob = await db.ActiveStorageBlob.build({
        name: blobName,
        key: file_key,
        record_id: resource.id,
        record_type: recordType,
        filename: file.originalName,
        content_type: file.mimeType,
        service_name: "local",
        metadata: "",
        byte_size: file_key.length,
        checksum: "",
      });

      var dir = `${rootDir}/${blob.getFolderPath()}`;

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const writeStream = fs.createWriteStream(`${dir}/${file.originalName}`);

      writeStream.on("error", (err) => {
        console.log("*******Error writing file:", err);
      });
      writeStream.on("finish", async () => {
        console.log("********File saved successfully", this, file);
        await blob.save();
      });
      passThroughStream.on("end", () => {
        console.log("********PassThrough stream ended");
      });
      passThroughStream.on("error", (err) => {
        console.log("********PassThrough stream error:", err);
      });
      await passThroughStream.pipe(writeStream);
      passThroughStream.end();
    }
  }
}

module.exports = {
  cryptPassword,
  comparePassword,
  getCurrentUser,
  printParams,
  compactAndUniq,
  addAttachment,
  validUrl,
  serializeData,
  deserializeData,
};

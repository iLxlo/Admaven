const fs = require("node:fs");
const { CronJob } = require("cron");

module.exports = class CoreDatabase {
  constructor(filePath, options) {
    this.jsonFilePath = filePath || "./Core/Database/Schemas/Users.json";

    this.options = options || {};

    if (this.options.backup && this.options.backup.enabled) {
      const path = this.options.backup.path || "./Database/Backups/";
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      const dailyBackup = new CronJob(
        "0 0 * * *",
        () => {
          this.makeSnapshot(path);
        },
        null,
        true,
        "Europe/Istanbul"
      );
      dailyBackup.start();
    }

    if (!fs.existsSync(this.jsonFilePath)) {
      fs.writeFileSync(this.jsonFilePath, "{}", "utf-8");
    }
  }

  makeSnapshot(path) {
    path = path || "./Database/Backups/";
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    const fileName = `snapshot-${Date.now()}.json`;
    fs.writeFileSync(
      `${path}${fileName}`,
      JSON.stringify(data, null, 2),
      "utf-8"
    );
  }

  saveDataToFile(data) {
    fs.writeFileSync(this.jsonFilePath, JSON.stringify(data, null, 2), "utf-8");
  }

  get(key) {
    let object = JSON.parse(fs.readFileSync(this.jsonFilePath));

    const properties = key.split(".");
    let index = 0;
    for (; index < properties.length; ++index) {
      object = object && object[properties[index]];
    }

    return object;
  }

  has(key) {
    return Boolean(this.get(key));
  }

  set(key, value) {
    let object = JSON.parse(fs.readFileSync(this.jsonFilePath));

    const properties = key.split(".");
    let index = 0;
    for (; index < properties.length - 1; ++index) {
      object = object[properties[index]];
    }
    object[properties[index]] = value;

    this.saveDataToFile(object);
  }

  delete(key) {
    let data = JSON.parse(fs.readFileSync(this.jsonFilePath));

    delete data[key];

    this.saveDataToFile(data);
  }

  add(key, count) {
    let data = JSON.parse(fs.readFileSync(this.jsonFilePath));

    if (!data[key]) data[key] = 0;
    data[key] += count;

    this.saveDataToFile(data);
  }

  subtract(key, count) {
    if (!data[key]) data[key] = 0;
    data[key] -= count;
    this.saveDataToFile(data);
  }

  push(key, element) {
    let data = JSON.parse(fs.readFileSync(this.jsonFilePath));

    if (!data[key]) {
      data[key] = [];
    }
    data[key].push(element);

    this.saveDataToFile(data);
  }

  pull(key, element) {
    let data = JSON.parse(fs.readFileSync(this.jsonFilePath));

    if (!data[key]) data[key] = [];
    data[key].splice(data[key].indexOf(element), 1);

    this.saveDataToFile(data);
  }

  clear() {
    this.saveDataToFile({});
  }

  all() {
    let data = JSON.parse(fs.readFileSync(this.jsonFilePath));

    return Object.keys(data).map((key) => {
      return {
        key,
        ownercord_data: data[key],
      };
    });
  }
};
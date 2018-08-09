const fs = require('fs');
const promisify = require('util').promisify;
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const path = require('path');
const mime = require('mime');
const compress = require('./compress');
const isFresh = require('./cache');

const Handlebars = require('handlebars');
const tplPath = path.join(__dirname, '../template/dir.tpl');
const source = fs.readFileSync(tplPath);
const template = Handlebars.compile(source.toString());



module.exports = async function(req, res, pathUrl, conf) {
    try {
        const stats = await stat(pathUrl);
        if (stats.isFile()) {
            const extName = path.extname(pathUrl).split('.')[1];
            const ContentType = mime.getType(extName);
            if(isFresh(stats, req, res)) {
                res.statusCode = 304;
                res.end();
                return;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', ContentType);
            let rs = fs.createReadStream(pathUrl);
            if(pathUrl.match(conf.compress)) {
                rs = compress(rs, req, res);
            }
            rs.pipe(res);

        } else if (stats.isDirectory()) {
            const files = await readdir(pathUrl);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            const dir = path.relative(conf.root, pathUrl);
            const data = {
                title: path.basename(pathUrl),
                dir: dir ? `/${dir}` : '',
                files
            };
            res.end(template(data));
        
        }
    } catch (error) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`${pathUrl} is not a directory or file`);
    }
};
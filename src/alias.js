import moduleAlias from 'module-alias';
import path from 'path';

moduleAlias.addAliases({
  '@src': __dirname,
  '@middlewares': path.join(__dirname, '/middlewares'),
  '@config': path.join(__dirname, '/config'),
  '@modules': path.join(__dirname, '/modules'),
});

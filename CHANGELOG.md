## 4.0.0 (2019-11-14)

### Features


#### Removed requires of consul, use options parameter ([7366ca4](https://github.com/sealsystems/node-http-server/commit/7366ca4))



### BREAKING CHANGES

#### Interface changed: consul is now part of options parameter.

Example:

```javascript
const httpServer = require('@sealsystems/http-server');
const consul = require('@sealsystems/consul');

consul.connect(...);

await httpServer.start({
  app: myExpressApp,
  host: '192.168.0.1',
  port: '3000',
  consul
});
```

---

## 3.3.0 (2019-10-18)

### Features


#### PLS-431, [PLS-431](https://jira.sealsystems.de/jira/browse/PLS-431) ([b94c76b](https://github.com/sealsystems/node-http-server/commit/b94c76b))

- Removed roboter
 - Updated scripts
 - Updated CircleCI config
 - Updated dependencies
 - Updated GitHub Pull Request template
 - Added dependabot config
 - Added `package-lock.json` to git
 - Used `seal-node:oss-module-update`


---

## 3.2.6 (2019-10-15)

### Chores


#### bump [@sealsystems](https://github.com/sealsystems)/tlscert from 2.2.1 to 2.3.0 ([3a0b09f](https://github.com/sealsystems/node-http-server/commit/3a0b09f))

Bumps @sealsystems/tlscert from 2.2.1 to 2.3.0.

Signed-off-by: dependabot-preview[bot] <support@dependabot.com>


---

## 3.2.5 (2019-10-08)

### Chores


#### bump [@sealsystems](https://github.com/sealsystems)/tlscert from 2.2.0 to 2.2.1 ([f37c56e](https://github.com/sealsystems/node-http-server/commit/f37c56e))

Bumps @sealsystems/tlscert from 2.2.0 to 2.2.1.

Signed-off-by: dependabot-preview[bot] <support@dependabot.com>


---

## 3.2.4 (2019-10-08)

### Chores


#### bump [@sealsystems](https://github.com/sealsystems)/log from 2.1.0 to 2.2.0 ([fc2f108](https://github.com/sealsystems/node-http-server/commit/fc2f108))

Bumps @sealsystems/log from 2.1.0 to 2.2.0.

Signed-off-by: dependabot-preview[bot] <support@dependabot.com>


---

## 3.2.3 (2019-09-27)

### Chores


#### bump [@sealsystems](https://github.com/sealsystems)/consul from 4.0.1 to 4.1.0 ([a3fe4f8](https://github.com/sealsystems/node-http-server/commit/a3fe4f8))

Bumps @sealsystems/consul from 4.0.1 to 4.1.0.

Signed-off-by: dependabot-preview[bot] <support@dependabot.com>


---

## 3.2.2 (2019-09-25)

### Chores


#### bump [@sealsystems](https://github.com/sealsystems)/tlscert from 2.1.2 to 2.2.0 ([e55905f](https://github.com/sealsystems/node-http-server/commit/e55905f))

Bumps @sealsystems/tlscert from 2.1.2 to 2.2.0.

Signed-off-by: dependabot-preview[bot] <support@dependabot.com>


---

## 3.2.1 (2019-09-18)

### Chores


#### bump [@sealsystems](https://github.com/sealsystems)/log from 2.0.26 to 2.1.0 ([259bc25](https://github.com/sealsystems/node-http-server/commit/259bc25))

Bumps @sealsystems/log from 2.0.26 to 2.1.0.

Signed-off-by: dependabot-preview[bot] <support@dependabot.com>


---

## 3.2.0 (2019-09-15)

### Features


#### PLS-431 ([21a611b](https://github.com/sealsystems/node-http-server/commit/21a611b))

- Removed roboter
 - Updated scripts
 - Installed latest development stack
 - Updated CircleCI-config and CircleCI-cache-key
 - Updated dependencies
 - Added package-lock.json to git
 - Merged with master
 - Updated github pull request template
 - Added dependabot


---

## 3.1.2 (2018-12-03)

### Bug Fixes


#### Include files in `lib/server/*` in npm package ([82c8b7f](https://github.com/sealsystems/node-http-server/commit/82c8b7f))



---

## 3.1.1 (2018-11-21)



---

## 3.1.0 (2018-09-09)

### Features


#### Use semantic-release ([19ffb84](https://github.com/sealsystems/node-http-server/commit/19ffb84))



---

/**
 * Initializes a Manhattan Class
 * @class Class Routes a connection, possibly using a constraint
 * @augments JCoreObject
 */
var ManhattanConnectionRouter = function () {
    this.mindist = 20;
};

ManhattanConnectionRouter.prototype = new Router();
ManhattanConnectionRouter.prototype.type = "ManhattanConnectionRouter";

/**
 * Method to route line using algoritm Manhattan
 * @param {connectioin} conn Commenction Object
 */
ManhattanConnectionRouter.prototype.createRoute = function (conn) {
    var fromPt, fromDir, toPt, toDir;

    fromPt = conn.sourcePort.getPoint(false);
    fromDir = conn.sourcePort.direction;

    toPt = conn.endPort.getPoint(false);
    toDir = conn.endPort.direction;

    // draw a line between the two points.
    this._route(conn, toPt, toDir, fromPt, fromDir);
};
/**
 * Function to find the best route using the algorithm manhattan
 * @function
 * @param {Connection} conn Connection Class
 * @param {Point} fromPt initial Point
 * @param {int} fromDir route using to begin line
 *        UP = 0; RIGHT= 1; DOWN = 2; LEFT = 3;
 * @param {Point} toPt final Point
 * @param {int} toDir route using to end line
 *        UP = 0; RIGHT= 1; DOWN = 2; LEFT = 3;
 */
ManhattanConnectionRouter.prototype._route = function (conn, fromPt, fromDir,
                                                       toPt, toDir) {
    var TOL,
        TOLxTOL,
        UP,
        RIGHT,
        DOWN,
        LEFT,
        xDiff,
        yDiff,
        nPoint,
        dir,
        pos;

    TOL = 0.1;
    TOLxTOL = 0.01;

    // fromPt is an x,y to start from.
    // fromDir is an angle that the first link must
    //
    UP = 0;
    RIGHT = 1;
    DOWN = 2;
    LEFT = 3;

    xDiff = fromPt.x - toPt.x;
    yDiff = fromPt.y - toPt.y;

    if (((xDiff * xDiff) < (TOLxTOL)) && ((yDiff * yDiff) < (TOLxTOL))) {
        conn.addSegment(new Point(toPt.x, toPt.y));
        return;
    }

    if (fromDir === LEFT) {
        if ((xDiff > 0) && ((yDiff * yDiff) < TOL) && (toDir === RIGHT)) {
            nPoint = toPt;
            dir = toDir;
        } else {
            if (xDiff < 0) {
                nPoint = new Point(fromPt.x - this.mindist, fromPt.y);
            } else if (((yDiff > 0) && (toDir === DOWN)) || ((yDiff < 0) &&
                (toDir === UP))) {
                nPoint = new Point(toPt.x, fromPt.y);
            } else if (fromDir === toDir) {
                pos = Math.min(fromPt.x, toPt.x) - this.mindist;
                nPoint = new Point(pos, fromPt.y);
            } else {
                nPoint = new Point(fromPt.x - (xDiff / 2), fromPt.y);
            }

            if (yDiff > 0) {
                dir = UP;
            } else {
                dir = DOWN;
            }
        }
    } else if (fromDir === RIGHT) {
        if ((xDiff < 0) && ((yDiff * yDiff) < TOL) && (toDir === LEFT)) {
            nPoint = toPt;
            dir = toDir;
        } else {
            if (xDiff > 0) {
                nPoint = new Point(fromPt.x + this.mindist, fromPt.y);
            } else if (((yDiff > 0) && (toDir === DOWN)) || ((yDiff < 0) &&
                (toDir === UP))) {
                nPoint = new Point(toPt.x, fromPt.y);
            } else if (fromDir === toDir) {
                pos = Math.max(fromPt.x, toPt.x) + this.mindist;
                nPoint = new Point(pos, fromPt.y);
            } else {
                nPoint = new Point(fromPt.x - (xDiff / 2), fromPt.y);
            }

            if (yDiff > 0) {
                dir = UP;
            } else {
                dir = DOWN;
            }
        }
    } else if (fromDir === DOWN) {
        if (((xDiff * xDiff) < TOL) && (yDiff < 0) && (toDir === UP)) {
            nPoint = toPt;
            dir = toDir;
        } else {
            if (yDiff > 0) {
                nPoint = new Point(fromPt.x, fromPt.y + this.mindist);
            } else if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) &&
                (toDir === LEFT))) {
                nPoint = new Point(fromPt.x, toPt.y);
            } else if (fromDir === toDir) {
                pos = Math.max(fromPt.y, toPt.y) + this.mindist;
                nPoint = new Point(fromPt.x, pos);
            } else {
                nPoint = new Point(fromPt.x, fromPt.y - (yDiff / 2));
            }

            if (xDiff > 0) {
                dir = LEFT;
            } else {
                dir = RIGHT;
            }
        }
    } else if (fromDir ===   UP) {
        if (((xDiff * xDiff) < TOL) && (yDiff > 0) && (toDir === DOWN)) {
            nPoint = toPt;
            dir = toDir;
        } else {
            if (yDiff < 0) {
                nPoint = new Point(fromPt.x, fromPt.y - this.mindist);
            } else if (((xDiff > 0) && (toDir === RIGHT)) || ((xDiff < 0) &&
                (toDir === LEFT))) {
                nPoint = new Point(fromPt.x, toPt.y);
            } else if (fromDir === toDir) {
                pos = Math.min(fromPt.y, toPt.y) - this.mindist;
                nPoint = new Point(fromPt.x, pos);
            } else {
                nPoint = new Point(fromPt.x, fromPt.y - (yDiff / 2));
            }

            if (xDiff > 0) {
                dir = LEFT;
            } else {
                dir = RIGHT;
            }
        }
    }
    this._route(conn, nPoint, dir, toPt, toDir);
    conn.addSegment(fromPt);
};

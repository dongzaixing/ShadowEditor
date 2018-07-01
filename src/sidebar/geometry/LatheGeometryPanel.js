﻿import SetGeometryCommand from '../../command/SetGeometryCommand';
import UI from '../../ui/UI';

/**
 * 车床几何体
 * @author rfm1201
 */
function LatheGeometryPanel(editor, object) {

    var container = new UI.Row();

    var geometry = object.geometry;
    var parameters = geometry.parameters;

    // segments

    var segmentsRow = new UI.Row();
    var segments = new UI.Integer({
        value: parameters.segments,
        onChange: update
    });

    segmentsRow.add(new UI.Text({
        text: '段数',
        style: 'width: 90px;'
    }));

    segmentsRow.add(segments);

    container.add(segmentsRow);

    // phiStart

    var phiStartRow = new UI.Row();

    var phiStart = new UI.Number({
        value: parameters.phiStart * 180 / Math.PI,
        onChange: update
    });

    phiStartRow.add(new UI.Text({
        text: 'φ开始 (°)',
        style: 'width: 90px;'
    }));

    phiStartRow.add(phiStart);

    container.add(phiStartRow);

    // phiLength

    var phiLengthRow = new UI.Row();

    var phiLength = new UI.Number({
        value: parameters.phiLength * 180 / Math.PI,
        onChange: update
    });

    phiLengthRow.add(new UI.Text({
        text: 'φ长度(°)',
        style: 'width: 90px;'
    }));

    phiLengthRow.add(phiLength);

    container.add(phiLengthRow);

    // points

    var lastPointIdx = 0;
    var pointsUI = [];

    var pointsRow = new UI.Row();

    pointsRow.add(new UI.Text({
        text: '点',
        style: 'width: 90px;'
    }));

    var points = new UI.Span({
        style: 'display: inline-block;'
    });

    pointsRow.add(points);

    var pointsList = new UI.Div();

    points.add(pointsList);

    for (var i = 0; i < parameters.points.length; i++) {

        var point = parameters.points[i];
        pointsList.add(createPointRow(point.x, point.y));

    }

    var addPointButton = new UI.Button({
        text: '+',
        onClick: function () {
            if (pointsUI.length === 0) {
                pointsList.add(createPointRow(0, 0));
            } else {
                var point = pointsUI[pointsUI.length - 1];
                pointsList.add(createPointRow(point.x.getValue(), point.y.getValue()));
            }

            update();
        }
    });

    points.add(addPointButton);

    container.add(pointsRow);

    //

    function createPointRow(x, y) {

        var pointRow = new UI.Div();

        var lbl = new UI.Text({
            text: lastPointIdx + 1,
            style: 'width: 20px;'
        });

        var txtX = new UI.Number({
            value: x,
            range: [0, Infinity],
            style: 'width: 40px;',
            onChange: update
        });

        var txtY = new UI.Number({
            value: y,
            style: 'width: 40px;',
            onChange: update
        });

        var idx = lastPointIdx;

        var btn = new UI.Button({
            text: '-',
            onClick: deletePointRow(idx)
        });

        pointsUI.push({ row: pointRow, lbl: lbl, x: txtX, y: txtY });
        lastPointIdx++;

        pointRow.add(lbl);
        pointRow.add(txtX);
        pointRow.add(txtY);
        pointRow.add(btn);

        return pointRow;

    }

    function deletePointRow(idx) {

        if (!pointsUI[idx]) return;

        pointsList.remove(pointsUI[idx].row);
        pointsUI[idx] = null;

        update();

    }

    function update() {

        var points = [];
        var count = 0;

        for (var i = 0; i < pointsUI.length; i++) {

            var pointUI = pointsUI[i];

            if (!pointUI) continue;

            points.push(new THREE.Vector2(pointUI.x.getValue(), pointUI.y.getValue()));
            count++;
            pointUI.lbl.setValue(count);

        }

        editor.execute(new SetGeometryCommand(object, new THREE[geometry.type](
            points,
            segments.getValue(),
            phiStart.getValue() / 180 * Math.PI,
            phiLength.getValue() / 180 * Math.PI
        )));

    }

    container.render();

    return container;
};

export default LatheGeometryPanel;
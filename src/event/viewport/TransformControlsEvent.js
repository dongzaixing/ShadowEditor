import BaseEvent from '../BaseEvent';
import SetPositionCommand from '../../command/SetPositionCommand';
import SetRotationCommand from '../../command/SetRotationCommand';
import SetScaleCommand from '../../command/SetScaleCommand';

/**
 * 变形控件事件
 * @param {*} app 
 */
function TransformControlsEvent(app) {
    BaseEvent.call(this, app);

    this.objectPositionOnDown = null;
    this.objectRotationOnDown = null;
    this.objectScaleOnDown = null;
}

TransformControlsEvent.prototype = Object.create(BaseEvent.prototype);
TransformControlsEvent.prototype.constructor = TransformControlsEvent;

TransformControlsEvent.prototype.start = function () {
    var transformControls = this.app.editor.transformControls;

    transformControls.addEventListener('change', this.onChange.bind(this));
    transformControls.addEventListener('mouseDown', this.onMouseDown.bind(this));
    transformControls.addEventListener('mouseUp', this.onMouseUp.bind(this));
};

TransformControlsEvent.prototype.stop = function () {
    var transformControls = this.app.editor.transformControls;

    transformControls.removeEventListener('change', this.onChange);
    transformControls.removeEventListener('mouseDown', this.onMouseDown);
    transformControls.removeEventListener('mouseUp', this.onMouseUp);
};

TransformControlsEvent.prototype.onChange = function () {
    var editor = this.app.editor;
    var transformControls = editor.transformControls;
    var selectionBox = editor.selectionBox;

    var object = transformControls.object;

    if (object !== undefined) {
        selectionBox.setFromObject(object);

        if (editor.helpers[object.id] !== undefined) {
            editor.helpers[object.id].update();
        }

        this.app.call('refreshSidebarObject3D', this, object);
    }

    this.app.call('render');
};

TransformControlsEvent.prototype.onMouseDown = function () {
    var editor = this.app.editor;
    var transformControls = editor.transformControls;
    var controls = editor.controls;

    var object = transformControls.object;

    this.objectPositionOnDown = object.position.clone();
    this.objectRotationOnDown = object.rotation.clone();
    this.objectScaleOnDown = object.scale.clone();

    controls.enabled = false;
};

TransformControlsEvent.prototype.onMouseUp = function () {
    var editor = this.app.editor;
    var transformControls = editor.transformControls;
    var controls = editor.controls;
    var objectPositionOnDown = this.objectPositionOnDown;
    var objectRotationOnDown = this.objectRotationOnDown;
    var objectScaleOnDown = this.objectScaleOnDown;

    var object = transformControls.object;

    if (object !== undefined) {
        switch (transformControls.getMode()) {
            case 'translate':
                if (!objectPositionOnDown.equals(object.position)) {
                    editor.execute(new SetPositionCommand(object, object.position, objectPositionOnDown));
                }
                break;
            case 'rotate':
                if (!objectRotationOnDown.equals(object.rotation)) {
                    editor.execute(new SetRotationCommand(object, object.rotation, objectRotationOnDown));
                }
                break;
            case 'scale':
                if (!objectScaleOnDown.equals(object.scale)) {
                    editor.execute(new SetScaleCommand(object, object.scale, objectScaleOnDown));
                }
                break;
        }
    }

    controls.enabled = true;
};

export default TransformControlsEvent;
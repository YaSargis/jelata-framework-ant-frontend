import React from 'react';
import { Popover, Icon } from 'antd';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

const Emoji = ({visiblePicker, setStateUpComp, addEmoji}) => {
  return <Popover
    trigger='click'
    visible={visiblePicker}
    onVisibleChange={(e) => setStateUpComp({visiblePicker: e})}
    content={
      <Picker
        emojiSize={24}
        title=''
        style={styles.editor__picker}
        onSelect={event => {
          addEmoji(event);
          setStateUpComp({visiblePicker: false});
        }}
        i18n={{
          search: 'Search',
          clear: 'Clean', // Accessible label on "clear" button
          notfound: 'Not found',
          skintext: 'Choose ypur skin color',
          categories: {
            search: 'result',
            recent: 'fav',
            people: 'smiles & humans',
            nature: 'animals & nature',
            foods: 'food, frink',
            activity: 'activity',
            places: 'travels&places',
            objects: 'objects',
            symbols: 'symbols',
            flags: 'flags',
            custom: 'Custom',
          },
          categorieslabel: 'Emoji categories', // Accessible title for the list of categories
          skintones: {
            1: 'Default Skin Tone',
            2: 'Light Skin Tone',
            3: 'Medium-Light Skin Tone',
            4: 'Medium Skin Tone',
            5: 'Medium-Dark Skin Tone',
            6: 'Dark Skin Tone',
          },
        }}
      />}
  >
    <Icon
      type="smile"
      style={styles.editor__icon}
      onClick={() => setStateUpComp({visiblePicker: !visiblePicker})}
    />
  </Popover>
};

const styles = {
  editor__picker: {
    position: 'absolute',
    bottom: 0,
    left: -320
  },
  editor__icon: {
    fontSize: 24,
    color: '#1b90fa',
    marginLeft: 30
  },
}

export default Emoji;

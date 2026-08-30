import React from 'react';
import Modal from 'components/Modal';
import { isItemAFolder } from 'utils/tabs';
import { useDispatch } from 'react-redux';
import { deleteItem, closeTabs } from 'providers/ReduxStore/slices/collections/actions';
import { clearSidebarSelection } from 'providers/ReduxStore/slices/app';
import { recursivelyGetAllItemUids } from 'utils/collections';
import StyledWrapper from '../DeleteCollectionItem/StyledWrapper';
import toast from 'react-hot-toast';

const BatchDeleteCollectionItem = ({ onClose, items = [], collectionUid }) => {
  const dispatch = useDispatch();
  const onConfirm = async () => {
    // Close tabs belonging to all selected items (folders include their children)
    const tabUids = items.flatMap((item) =>
      isItemAFolder(item) ? [...recursivelyGetAllItemUids(item.items), item.uid] : [item.uid]
    );
    dispatch(closeTabs({ tabUids }));

    let failed = 0;
    for (const item of items) {
      try {
        await dispatch(deleteItem(item.uid, collectionUid));
      } catch (error) {
        failed += 1;
        console.error('Error deleting item', item.name, error);
        toast.error(`Failed to delete ${item.name}`);
      }
    }
    dispatch(clearSidebarSelection());
    if (!failed) {
      onClose();
    }
  };

  return (
    <StyledWrapper>
      <Modal
        size="md"
        title={`Delete ${items.length} items`}
        confirmText="Delete"
        confirmButtonColor="danger"
        handleConfirm={onConfirm}
        handleCancel={onClose}
      >
        Are you sure you want to delete <span className="font-medium">{items.length} items</span>? Folders
        are deleted together with all of their contents.
      </Modal>
    </StyledWrapper>
  );
};

export default BatchDeleteCollectionItem;

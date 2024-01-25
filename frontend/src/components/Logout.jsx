import { useState } from 'react';
import Modal from 'react-modal';
import axios from 'axios';

Modal.setAppElement('#root'); // replace '#root' with the id of your app's root element

const Logout = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('/logout/'); // replace with your logout endpoint
      if (response.status === 200) {
        // Handle successful logout here
        console.log('Logged out');
        localStorage.removeItem('userId');
      }
    } catch (error) {
      console.log('Logout failed');
    }
    closeModal();
  };

  return (
    <div>
      <button onClick={openModal}>Logout</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Logout Modal"
      >
        <h2>Are you sure you want to logout?</h2>
        <button onClick={handleLogout}>Yes</button>
        <button onClick={closeModal}>No</button>
      </Modal>
    </div>
  );
};

export default Logout;
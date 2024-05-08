import React from 'react';
import { DropdownButton, Dropdown } from 'react-bootstrap';

const CustomDropdown = () => {
  return (
    <DropdownButton id="dropdown-basic-button" title="Opções" variant="primary">
      <Dropdown.Item href="#/action-1">Editar dados</Dropdown.Item>
      <Dropdown.Item href="#/action-2">Mudar senha</Dropdown.Item>
      <Dropdown.Item href="#/action-3">Excluir dados</Dropdown.Item>
    </DropdownButton>
  );
}

export default CustomDropdown;

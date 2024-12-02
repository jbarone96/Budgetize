import React from "react";
import { Button, DatePicker, Form, Input, Modal } from "antd";

const AddExpense = ({ isModalVisible, handleExpense, onFinish }) => {
  const [form] = Form.useForm();

  return (
    <Modal
      style={{ fontWeight: 600 }}
      title="Add Expense"
      open={isModalVisible}
      onCancel={handleExpense}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "expense");
          form.resetFields();
        }}
      >
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please enter the name of the transaction.",
            },
          ]}
        >
          <Input type="text" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Amount"
          name="amount"
          rules={[
            {
              required: true,
              message: "Please enter the amount of the transaction.",
            },
          ]}
        >
          <Input type="number" className="custom-input" />
        </Form.Item>
        <Form.Item
          style={{ fontWeight: 600 }}
          label="Date"
          name="date"
          rules={[
            {
              required: true,
              message: "Please enter the date of the transaction.",
            },
          ]}
        >
          <DatePicker className="custom-input" format="MM-DD-YYYY" />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" className="btn reset-balance-btn">
            Add Expense
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddExpense;

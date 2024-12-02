import React from "react";
import { Button, DatePicker, Form, Input, Modal } from "antd";

const AddIncome = ({ isModalVisible, handleIncome, onFinish }) => {
  const [form] = Form.useForm();

  return (
    <div>
      <Modal
        title="Add Income"
        open={isModalVisible}
        onCancel={handleIncome}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            onFinish(values, "income");
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
                message: "Please enter the name of the income source.",
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
                message: "Please enter the income amount.",
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
                message: "Please enter the date of the income.",
              },
            ]}
          >
            <DatePicker className="custom-input" format="MM-DD-YYYY" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" className="btn reset-balance-btn">
              Add Income
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AddIncome;

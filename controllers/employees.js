const { prisma } = require("../prisma/prisma-client");

/**
 * @route GET /api/user/employees
 * @desc Получение всех сотрудников
 * @access Private
 */
const all = async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();

    res.status(200).json(employees);
  } catch (err) {
    res.status(500).json({
      message: "Не удалось получить сотрудников",
    });
  }
};

/**
 * @route POST /api/user/employees/add
 * @desc Добавить сотрудника
 * @access Private
 */
const add = async (req, res) => {
  try {
    const data = req.body;

    if (!data.firstName || !data.lastName || !data.address || !data.age) {
      return res.status(400).json({
        message: "Все поля обязательные",
      });
    }

    const employee = await prisma.employee.create({
      data: {
        ...data,
        userId: req.user.id,
      },
    });

    return res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({
      message: "Что-то пошло не так",
    });
  }
};

/**
 * @route POST /api/user/employees/remove/:id
 * @desc Удалить сотрудника
 * @access Private
 */
const remove = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.employee.delete({
      where: {
        id: id,
      },
    });

    res.status(204).json("OK");
  } catch (error) {
    return res.status(500).json({
      message: "Не удалось удалить сотрудника",
    });
  }
};

/**
 * @route PUT /api/user/employees/edit/:id
 * @desc Редактирование сотрудника
 * @access Private
 */
const edit = async (req, res) => {
  try {
    const data = req.body;
    const { id } = req.params;

    await prisma.employee.update({
      where: {
        id,
      },
      data,
    });

    res.status(204).json("OK");
  } catch (error) {
    res.status(500).json({ message: "Не удалось редактировать сотрудника" });
  }
};

/**
 * @route GET /api/user/employees/:id
 * @desc Получение одного сотрудника
 * @access Private
 */
const employee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await prisma.employee.findUnique({
      where: {
        id,
      },
    });

    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Не удалось получить сотрудника" });
  }
};

module.exports = {
  all,
  add,
  remove,
  edit,
  employee,
};

import { celebrate, Segments, Joi } from "celebrate";

const JoiId = Joi.number().integer().positive();

class PointsValiation {
  index = celebrate({
    [Segments.QUERY]: Joi.object({
      city: Joi.string().required(),
      uf: Joi.string().required(),
      items: Joi.string()
        .regex(/\d+(,\d+)*/)
        .required(),
    }).required(),
  }, { abortEarly: false });

  store = celebrate({
    [Segments.BODY]: Joi.object({
      point: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        whatsapp: Joi.string().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        uf: Joi.string().required().length(2),
        city: Joi.string().required(),
      }).required(),
      items: Joi.array().items(JoiId).required(),
    }).required(),
  }, { abortEarly: false });

  delete = celebrate({
    [Segments.PARAMS]: Joi.object({ id: JoiId })
  });
}

export default new PointsValiation();

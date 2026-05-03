import { getCompanyById } from "../store/company.store.js";

export const getCompany = (req, res, next) => {
  const headerCompanyId = req.headers["x-company-id"];
  const bodyCompanyId = req.body?.companyId;
  const companyId = bodyCompanyId || headerCompanyId;

  if (!companyId) {
    return res.status(400).json({
      status: "error",
      message: "Missing companyId",
    });
  }

  const company = getCompanyById(companyId);

  if (!company) {
    return res.status(404).json({
      status: "error",
      message: "Company not found",
    });
  }

  req.companyId = companyId;
  req.company = company;
  return next();
};

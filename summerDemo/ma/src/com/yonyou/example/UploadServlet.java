package com.yonyou.example;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.yonyou.uap.um.context.util.UmContextUtil;
import com.yonyou.uap.um.context.util.UmContextUtil.FsOperator;
import com.yonyou.uap.um.controller.UmControllerException;
import com.yonyou.uap.um.json.JSONTool;
import com.yonyou.uap.um.ma.common.MAUtil;

import nc.vo.jcom.lang.StringUtil;

public class UploadServlet extends HttpServlet{
 
	private static final long serialVersionUID = 5009692626436714447L;
	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		this.doPost(req, resp);
	}

	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		String user = UmContextUtil.handleNULLStr(req.getParameter(UmContextUtil.KEY_USER));
		//tomcat的默认编码方式是iso-8859-1,将字符串转换为utf-8,解决了传输过程中出现的乱码问题
		user = new String (user.getBytes("ISO-8859-1"),"utf-8");
		String appid = UmContextUtil.handleNULLStr(req.getParameter(UmContextUtil.KEY_APPID));
		appid = new String (appid.getBytes("ISO-8859-1"),"utf-8");
		
		String token = UmContextUtil.handleNULLStr(req.getParameter(UmContextUtil.KEY_TOKEN));
		appid = new String (token.getBytes("ISO-8859-1"),"utf-8");
		
		String devid = UmContextUtil.handleNULLStr(req.getParameter(UmContextUtil.KEY_DEVID));
		appid = new String (devid.getBytes("ISO-8859-1"),"utf-8");
		
		InputStream is = req.getInputStream();
		
		//定义默认返回字符串,字符串中输出引号，需要进行转义，code=0表示上传失败
		String retStr = "{\"code\":\"0\",\"msg\":\"false\"}";
		if(req.getContentLength() > 0 && req.getContentType().contains("multipart")&& is!=null ){
			//用于管理解析请求产生的数据的存储问题，根据临界值，判断是存储在内存中还是在磁盘中
			DiskFileItemFactory factory = new DiskFileItemFactory();
			//临时文件大小为4G
			factory.setSizeThreshold(4*1024*1024);
			/*
			 * 在fileupload包中，HTTP请求中的复杂表单元素都被看做一个FileItem对象；FileItem对象必须由ServletFileUpload类中
			 * 的parseRequest（）方法解析http请求（即被包装之后的HttpServletRequest对象）出来；而ServletFileUpload对象的
			 * 创建需要依赖于FileItemFactory工厂将获得的上传那文件FileItemFactory工厂将获得的上传文件FileItem对象保存至服务器硬盘
			 * ，即DiskFileItem对象，简单点说，就是ServletFileUpload负责解析请求，DiskFileItemFactory负责保存解析后的FileItem
			 * 对象.
			 */
			ServletFileUpload upload = new ServletFileUpload(factory);
			List<FileItem> fileList = null;
				
			try {
				fileList = upload.parseRequest(req);
				//获取UPLOAD_FILES路径
				String realPath = req.getServletContext().getRealPath("UPLOAD_FILES/");
				//String maHome = MAHomeFactory.MA_HOME;
				//String fileDir = maHome+File.separator+"UPLOAD";
				Map<String,Object> filePathMap = uploadFile(realPath,user,appid,fileList);
				if(filePathMap!=null &&!filePathMap.isEmpty())
				{	
					//获取项目路径
					String contextPath = req.getServletContext().getContextPath();
					//获取文件的绝对路径
					String urlpath = contextPath+"/UPLOAD_FILES/"+filePathMap.get("filename");
					StringBuffer url = req.getRequestURL();
					Map<String,Object> map = filePathMap; 
					map.put("code", "1");
					map.put("msg", "true");
					map.put("urlpath", urlpath);
					retStr = JSONTool.mapToJson(map, 4);
				}
				
			} catch (Exception e) {
				throw new UmControllerException(e);
			}
		}
		
		String contentType = "application/json;charset=UTF-8";
		resp.setContentType(contentType);
		resp.setHeader("Pragma", "No-cache");
		byte b[] = retStr.toString().getBytes("UTF-8");
		OutputStream out = resp.getOutputStream();
		out.write(b);
	}
	
	/*
	 * upload file for upload Servlet
	 * @param dir
	 * @param user
	 * @param appid
	 * @param listFile
	 * @throw Exception
	 */
	
	/**
	 * @param dir
	 * @param user
	 * @param appid
	 * @param listFile
	 * @return
	 */
	public Map<String,Object> uploadFile(String dir,String user,String appid,List<FileItem> listFile){
		Map<String,Object> result = new HashMap<String,Object>();
		if(listFile==null || listFile.size()==0){
			return null;
		}
		try{
			//遍历listFile
			for(FileItem item:listFile){
//				getFieldName方法用来返回表单标签的name属性的值
				String name = item.getFieldName();
				/*
				 * isFormField方法用来判断FileItem对象里面封装的数据是一个普通文本表单字段，还是一个文件表单字段。
				 * 如果是普通文本表单字段，返回一个true否则返回一个false。因此可以用该方法判断是否是普通表单域
				 * 还是文件上传表单域
				 */
				if(item.isFormField()){
					/*
					 * getString()方法将FileItem对象中保存的数据流内容以一个字符串返回。它有两个重载形式。
					 * public Java.lang.String getString()和public java.lang.String 
					 * getString(java.lang.String encoding) throws java.io.InsupportedEncodingException.
					 * 前者使用缺省的字符集编码将主题内容转换成字符串，后者使用参数制定的字符集编码。如果在读取普通表单字段元素的内容时，
					 * 出现了乱码现象，可以调用第二个方法，并传入正确的字符集编码名称
					 */
					String value = item.getString();
					/*
					 * 如果传入的user为空，且name变量值为user
					 */
					if(StringUtil.isEmpty(user) && "user".equals(name.trim())){
						user = value;
					}else if(StringUtil.isEmpty(appid)&& "appid".equals(name.trim())){
						appid = value;
					}
					
				}
			}
			
			//如果是文件表单字段
			for(FileItem item:listFile){
				if(!item.isFormField()){
//					getName()方法用来获得文件上传字段中的文件名
					String fileName= item.getName().trim();
					File saveFile =new File(dir, fileName);
//					获得文件流
				//	InputStream fileInputStream = item.getInputStream();
//					执行保存文件操作
				//	Object filePath = UmContextUtil.invokeFileService(FsOperator.UPLOAD,appid,fileName,item.getInputStream(),
	//						null,"{}").get(MAUtil.KEY_FILE_PATH);
					item.write(saveFile);
					result.put("filename", fileName);
				}
			}
			
		}catch(Exception e){
			e.printStackTrace();
		}
		return result;
	}
}
